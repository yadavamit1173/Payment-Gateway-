import crypto from "crypto";
import pool from "../db.js";

function hashBody(body) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(body))
    .digest("hex");
}

export async function idempotencyMiddleware(req, res, next) {
  const key = req.header("Idempotency-Key");

  if (!key) {
    return res.status(400).json({
      error: "Idempotency-Key header is required"
    });
  }

  const userId = req.user.id;
  const endpoint = `${req.method}:${req.path}`;
  const requestHash = hashBody(req.body);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const insertResult = await client.query(
      `
      INSERT INTO idempotency_keys
        (user_id, idempotency_key, endpoint, request_hash, status, locked_until)
      VALUES
        ($1, $2, $3, $4, 'processing', now() + interval '5 minutes')
      ON CONFLICT (user_id, idempotency_key, endpoint)
      DO NOTHING
      RETURNING *
      `,
      [userId, key, endpoint, requestHash]
    );

    if (insertResult.rows.length > 0) {
      await client.query("COMMIT");

      req.idempotency = {
        key,
        userId,
        endpoint,
        requestHash,
        isOwner: true
      };

      return next();
    }

    const existingResult = await client.query(
      `
      SELECT *
      FROM idempotency_keys
      WHERE user_id = $1
        AND idempotency_key = $2
        AND endpoint = $3
      `,
      [userId, key, endpoint]
    );

    const record = existingResult.rows[0];

    if (record.request_hash !== requestHash) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Same idempotency key used with different request payload"
      });
    }

    if (record.status === "completed") {
      await client.query("COMMIT");
      return res.status(record.response_code).json(record.response_body);
    }

    if (record.status === "processing") {
      await client.query("COMMIT");
      return res.status(409).json({
        error: "Request with this idempotency key is already processing"
      });
    }

    await client.query("COMMIT");

    return res.status(500).json({
      error: "Previous request failed. Please retry with a new idempotency key."
    });

  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}