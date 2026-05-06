/*
Gateway
-> Webhook API
-> Verify signature
-> Update mandate status
-> Send notification



*/

app.post("/webhooks/mandate", async (req, res) => {
  const event = req.body;

  if (!verifySignature(req)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  if (event.type === "MANDATE_APPROVED") {
    await db.mandates.updateByGatewayId(event.mandateId, {
      status: "ACTIVE",
      next_charge_at: getNextBillingDate()
    });
  }

  res.json({ received: true });
});