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


Retry Method
User clicks Pay
-> Backend creates internal order
-> Backend calls PG create-order
-> PG timeout
-> Backend checks DB/idempotency key
-> Retry with same receipt/idempotency key
-> If still unknown, mark PG_CREATE_PENDING
-> Background job checks PG status

1. Timeout ka matlab failure nahi hota
Backend -> PG request sent
-> PG ne order create kar diya
-> But response backend tak nahi aaya

3. Correct way ✅ Use Idempotency Key

Idempotency key ka matlab:
Same operation ka unique key
-> repeat request aaye to same result mile
-> duplicate operation na ho

First request timeout
-> Retry with same idempotency key
-> PG says same operation already processed
-> returns same pg_order_id




Request
→ DB checks stock >= 1
→ DB reduces stock in same operation
→ If affected rows = 1, success
→ If affected rows = 0, out of stock