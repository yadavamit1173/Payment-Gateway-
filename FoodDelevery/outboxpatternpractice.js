
/*

CREATE TABLE outbox_events (
  id VARCHAR(50) PRIMARY KEY,
  event_type VARCHAR(50),
  payload JSON,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

*/

async function publishOutboxEvents() {
  const events = await db.query(`
    SELECT * FROM outbox_events
    WHERE status = 'PENDING'
    ORDER BY created_at
    LIMIT 100
  `);

  for (const event of events.rows) {
    await producer.send({
      topic: "refund-requested",
      messages: [{ value: JSON.stringify(event.payload) }]
    });

    await db.query(`
      UPDATE outbox_events
      SET status = 'PUBLISHED'
      WHERE id = $1
    `, [event.id]);
  }
}