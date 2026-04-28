async function payNow() {
  const res = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 500, productId: 'p1' })
  })

  const data = await res.json()
  openPaymentGateway(data)
}

