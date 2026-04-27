Payment Gateway Flow 


User clicks Pay
-> Frontend calls Backend: create order
-> Backend creates Order in DB as PENDING
-> Backend calls Payment Gateway
-> PG returns gateway_order_id / payment_intent_id
-> Backend sends this to Frontend
-> Frontend opens PG checkout
-> User pays on PG page
-> PG returns payment_id/token to Frontend
-> Frontend sends payment_id to Backend
-> Backend verifies payment with PG using secret key
-> Backend updates DB
-> PG also sends Webhook
-> Backend confirms final status from webhook