app.post("/payments", async (req, res) => {
  const key = req.header("Idempotency-Key");
  if (!key) return res.status(400).json({ error: "Missing Idempotency-Key" });

  const requestHash = hashRequest(req.user.id, req.method, req.path, req.body);

  const existing = await db.idempotencyKeys.findOne({
    key,
    user_id: req.user.id
  });

  if (existing) {
    if (existing.request_hash !== requestHash) {
      return res.status(409).json({
        error: "Idempotency key reused with different request"
      });
    }

    if (existing.status === "SUCCESS") {
      return res.status(existing.response_code).json(existing.response_body);
    }

    return res.status(409).json({ error: "Request already in progress" });
  }

  await db.idempotencyKeys.insert({
    key,
    user_id: req.user.id,
    request_hash: requestHash,
    status: "IN_PROGRESS",
    expires_at: addDays(new Date(), 7)
  });

  const payment = await createPayment(req.body);

  const responseBody = { paymentId: payment.id, status: payment.status };

  await db.idempotencyKeys.update({
    key,
    user_id: req.user.id,
    status: "SUCCESS",
    response_code: 201,
    response_body: responseBody,
    resource_type: "payment",
    resource_id: payment.id
  });

  return res.status(201).json(responseBody);
});