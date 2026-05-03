// User enables autopay
fetch("/api/autopay/mandate", {
  method: "POST",
  body: JSON.stringify({
    userId: "u1",
    amount: 499,
    frequency: "MONTHLY"
  }),
  headers: { "Content-Type": "application/json" }
});