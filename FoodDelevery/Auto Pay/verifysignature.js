/*

Real Production flow 

Payment Gateway
 -> POST /webhooks/mandate
 -> Headers:
      x-signature: abc123
 -> Body:
      { payment data }

Backend
 -> Read raw body
 -> Generate HMAC hash
 -> Compare signatures
 -> Valid? Process
 -> Invalid? Reject

*/
const crypto = require("crypto");

function verifySignature(req) {
  const receivedSignature = req.headers["x-signature"];

  if (!receivedSignature) {
    return false;
  }

  const webhookSecret = process.env.WEBHOOK_SECRET;

  const rawBody = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature),
    Buffer.from(expectedSignature)
  );
}