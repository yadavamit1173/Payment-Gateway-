await client.query('BEGIN');

const product = await client.query(
  'SELECT stock FROM products WHERE id = $1 FOR UPDATE',
  [productId]
);

if (product.rows[0].stock < quantity) {
  throw new Error('Out of stock');
}

await client.query(
  'UPDATE products SET stock = stock - $1 WHERE id = $2',
  [quantity, productId]
);


await client.query('COMMIT');

/*
database sql 

BEGIN;

SELECT stock
FROM products
WHERE id = 101
FOR UPDATE;

UPDATE products
SET stock = stock - 1
WHERE id = 101;

COMMIT;

*/