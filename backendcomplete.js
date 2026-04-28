app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (!productId || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const amount = product.price * quantity

    const order = await Order.create({
      userId: req.user.id,
      productId,
      quantity,
      amount,
      status: 'PAYMENT_PENDING'
    })

    const pgOrder = await paymentGateway.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: order.id
    })

    await Order.updateOne(
      { _id: order.id },
      {
        pgOrderId: pgOrder.id,
        pgStatus: pgOrder.status
      }
    )

    res.json({
      orderId: order.id,
      pgOrderId: pgOrder.id,
      amount: pgOrder.amount,
      currency: pgOrder.currency,
      publicKey: process.env.PG_PUBLIC_KEY
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Payment order creation failed' })
  }
})