Refund cancellation 


User clicks Cancel
-> Frontend calls Cancellation API
-> Cancellation Service marks order CANCELLED
-> Creates Refund Request in DB with status PENDING
-> Publishes refund event to Kafka/SQS
-> Refund Worker consumes event
-> Calls Refund Service / Payment Gateway
-> If failed, retry with backoff
-> If success, mark REFUNDED
-> User gets notification