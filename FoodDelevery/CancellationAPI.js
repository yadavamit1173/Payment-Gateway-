app.post("/api/orders/:orderId/cancel", async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  await cancelOrderAndCreateRefund(orderId, userId);

  res.json({
    success: true,
    message: "Order cancelled. Refund will be processed shortly."
  });
});