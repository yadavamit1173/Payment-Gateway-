AutoPay Payment System Architecture

1. High-Level Flow

User enables AutoPay
-> Frontend
-> Backend API
-> Mandate Service
-> Payment Gateway / Bank
-> Mandate Active
-> Scheduler
-> Payment Debit
-> Success / Retry / Failure