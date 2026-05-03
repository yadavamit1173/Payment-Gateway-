/*

1. Mandate Service

Mandate = user ki permission for recurring debit.

Used for:

User consent
-> Bank authorization
-> Future auto debit allowed


*/
app.post("/api/autopay/mandate", async (req, res) => {
  const mandate = await mandateService.createMandate(req.body);

  res.json({
    mandateId: mandate.id,
    authUrl: mandate.authUrl
  });
});

/*CREATE TABLE mandates (
  id UUID PRIMARY KEY,
  user_id UUID,
  amount INT,
  frequency VARCHAR(20),
  status VARCHAR(20),
  next_charge_at TIMESTAMP,
  gateway_mandate_id VARCHAR(100),
  created_at TIMESTAMP
);

PENDING -> ACTIVE -> PAUSED -> CANCELLED -> EXPIRED
*/