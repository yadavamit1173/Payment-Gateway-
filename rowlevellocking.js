const result = await db.query(`
  UPDATE products
  SET stock = stock - $1
  WHERE id = $2 AND stock >= $1
`, [quantity, productId]);

if (result.rowCount === 0) {
  throw new Error('Out of stock');
}

