const db = require("../connection");

// GET CART ITEMS
function getCartByUser(userId, callback) {
  const sql = `
    SELECT 
      cart.id,
      cart.product_id,
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

  db.query(
    sql,
    [user_id, product_id, Number(quantity) || 1],
    callback
  );
}


// UPDATE CART
function updateCart(user_id, product_id, quantity, callback) {

  const sql = `
    UPDATE cart
    SET quantity = ?
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(sql, [quantity, user_id, product_id], callback);
}


// REMOVE ITEM
function removeItem(user_id, product_id, callback) {

  const sql = `
    DELETE FROM cart
    WHERE user_id = ? AND product_id = ?
  `;

  db.query(sql, [user_id, product_id], callback);
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
  getCartCount,
  updateCart,
  removeItem
};