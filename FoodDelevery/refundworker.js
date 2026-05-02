consumer.on("message", async (message) => {
  const event = JSON.parse(message.value);

  await processRefund(event.refundId);
});

async function processRefund(refundId) {
  const refund = await db.query(
    "SELECT * FROM refund_requests WHERE id = $1",
    [refundId]
  );

  if (refund.rows[0].status === "REFUNDED") {
    return;
  }

  await db.query(
    "UPDATE refund_requests SET status = 'PROCESSING' WHERE id = $1",
    [refundId]
  );

  try {
    await callPaymentGatewayRefund(refund.rows[0]);

    await db.query(`
      UPDATE refund_requests
      SET status = 'REFUNDED', updated_at = NOW()
      WHERE id = $1
    `, [refundId]);

  } catch (err) {
    await markRefundRetryable(refundId);
  }
}