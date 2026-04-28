app.post('/api/payments/create-order', async (req, res) => {
  const { amount, productId } = req.body

  const order = await Order.create({
    productId,
    amount,
    status: 'PENDING'
  })

  res.json({ orderId: order.id })
})
/*
INSERT INTO orders (id, amount, status)
VALUES ('ord_101', 500, 'PENDING');
*/