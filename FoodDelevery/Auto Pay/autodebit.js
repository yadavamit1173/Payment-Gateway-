worker.process("AUTO_DEBIT", async (job) => {
  const mandate = await db.mandates.find(job.data.mandateId);

  const payment = await db.payments.insert({
    mandate_id: mandate.id,
    status: "INITIATED",
    amount: mandate.amount
  });

  const result = await paymentGateway.debitMandate({
    gatewayMandateId: mandate.gateway_mandate_id,
    amount: mandate.amount,
    idempotencyKey: payment.id
  });

  await db.payments.update(payment.id, {
    status: result.status
  });
});