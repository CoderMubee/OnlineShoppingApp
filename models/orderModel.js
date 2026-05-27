const db = require("../connection");


// CREATE ORDER
function createOrder(userId, totalAmount, callback) {
  const sql = `
    INSERT INTO orders (user_id, total_amount)
    VALUES (?, ?)
  `;

  db.query(sql, [userId, totalAmount], callback);
}


// INSERT ORDER ITEMS (BULK)
function createOrderItems(values, callback) {
  const sql = `
    INSERT INTO order_items
    (order_id, product_id, quantity, price)
    VALUES ?
  `;

  db.query(sql, [values], callback);
}


// GET USER ORDERS
function getOrdersByUser(userId, callback) {
  const sql = `
    SELECT * FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], callback);
}

// GET FULL ORDER DETAILS
function getOrderDetails(userId, callback) {

  const sql = `
    SELECT
      orders.id AS order_id,
      orders.total_amount,
      orders.status,
      orders.created_at,

      products.name,
      products.image_url,

      order_items.quantity,
      order_items.price

    FROM orders

    JOIN order_items
      ON orders.id = order_items.order_id

    JOIN products
      ON order_items.product_id = products.id

    WHERE orders.user_id = ?

    ORDER BY orders.created_at DESC
  `;

  db.query(sql, [userId], callback);
}

module.exports = {
  createOrder,
  createOrderItems,
  getOrdersByUser,
  getOrderDetails
};