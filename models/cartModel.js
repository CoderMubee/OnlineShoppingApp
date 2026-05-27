const db = require("../connection");

// GET CART ITEMS
function getCartByUser(userId, callback) {
  const sql = `
    SELECT 
      cart.id,
      cart.quantity,
      products.name,
      products.price,
      products.image_url
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], callback);
}


// ADD TO CART
function addToCart(user_id, product_id, quantity, callback) {
  const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
    quantity = quantity + VALUES(quantity)
  `;

  db.query(sql, [user_id, product_id, quantity || 1], callback);
}


// GET CART COUNT
function getCartCount(userId, callback) {
  const sql = `
    SELECT SUM(quantity) AS total
    FROM cart
    WHERE user_id = ?
  `;

  db.query(sql, [userId], callback);
}

module.exports = {
  getCartByUser,
  addToCart,
  getCartCount
};