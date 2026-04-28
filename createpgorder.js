async function createPgOrder() {
  return paymentGateway.orders.create({
    amount: 50000,
    currency: 'INR'
  })
}

const pgOrder = await retryWithBackoff(createPgOrder)