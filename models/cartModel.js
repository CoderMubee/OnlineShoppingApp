const db = require("../connection");

// GET CART ITEMS (WITH STOCK)
function getCartByUser(userId, callback) {

  const sql = `
    SELECT 
      cart.id,
      cart.product_id,
      cart.quantity,
      products.name,
      products.price,
      products.image_url,
      products.stock
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], callback);
}

// ADD TO CART
function addToCart(user_id, product_id, quantity, callback) {

  const checkSql = `
    SELECT stock FROM products WHERE id = ?
  `;

  db.query(checkSql, [product_id], (err, result) => {

    if (err) return callback(err);

    const stock = result[0]?.stock || 0;

    if (quantity > stock) {
      return callback({
        message: "Not enough stock available"
      });
    }

    const sql = `
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      quantity = quantity + VALUES(quantity)
    `;

    db.query(sql, [user_id, product_id, quantity], callback);
  });
}

// UPDATE CART
function updateCart(user_id, product_id, quantity, callback) {

  const checkSql = `SELECT stock FROM products WHERE id = ?`;

  db.query(checkSql, [product_id], (err, result) => {

    if (err) return callback(err);

    const stock = result[0]?.stock || 0;

    if (quantity > stock) {
      return callback({
        message: "Not enough stock available"
      });
    }

    const sql = `
      UPDATE cart
      SET quantity = ?
      WHERE user_id = ? AND product_id = ?
    `;

    db.query(sql, [quantity, user_id, product_id], callback);
  });
}

// REMOVE ITEM
function removeItem(user_id, product_id, callback) {

  const sql = `
    DELETE FROM cart
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(sql, [user_id, product_id], callback);
}

// CLEAR CART
function clearCart(user_id, callback) {

  const sql = `
    DELETE FROM cart WHERE user_id = ?
  `;

  db.query(sql, [user_id], callback);
}

// GET CART COUNT
function getCartCount(userId, callback) {

  const sql = `
    SELECT SUM(quantity) AS total
    FROM cart
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return callback(err);

    const total = result[0].total || 0;
    callback(null, total);
  });
}

module.exports = {
  getCartByUser,
  addToCart,
  updateCart,
  removeItem,
  getCartCount,
  clearCart
};