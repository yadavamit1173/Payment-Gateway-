await producer.send({
  topic: "refund-requested",
  messages: [
    {
      key: orderId,
      value: JSON.stringify({
        refundId: "refund_123",
        orderId: "order_123",
        amount: 499
      })
    }
  ]
});

/*
Cancellation Service
-> Kafka/SQS
-> Refund Worker
-> Payment Gateway



*/