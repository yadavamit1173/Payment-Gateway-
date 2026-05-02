await fetch("/api/orders/order_123/cancel", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ reason: "User cancelled" })
});