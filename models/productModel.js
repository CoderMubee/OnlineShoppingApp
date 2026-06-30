const db = require("../connection");

// ===================== GET PRODUCTS (For Admin) =====================
function getAllProducts(callback) {

  const sql = `
    SELECT *
    FROM products
    ORDER BY id DESC
  `;

  db.query(sql, callback);
}
// ===================== GET PRODUCTS =====================
function getProducts(callback) {

  const sql = `
    SELECT *
    FROM products
    WHERE is_active = 1
    ORDER BY id DESC
  `;

  db.query(sql, callback);
}

// ===================== GET PRODUCT BY ID =====================
function getProductById(id, callback) {

  const sql = `
    SELECT *
    FROM products
    WHERE id = ?
  `;

  db.query(sql, [id], callback);
}


// ===================== ADD PRODUCT =====================
function addProduct(values, callback) {

  const sql = `
    INSERT INTO products
    (name, price, image_url, category, description, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, values, callback);
}


// ===================== UPDATE PRODUCT =====================
function updateProduct(id, values, callback) {

  const sql = `
    UPDATE products
    SET
      name = ?,
      price = ?,
      image_url = ?,
      category = ?,
      description = ?,
      stock = ?
    WHERE id = ?
  `;

  db.query(sql, [...values, id], callback);
}


// ===================== DELETE PRODUCT =====================
function deleteProduct(id, callback) {

  const sql = `
    UPDATE products
    SET is_active = 0
    WHERE id = ?
  `;

  db.query(sql, [id], callback);
}

// Handle Stock Reduction
function reduceStock(productId, quantity, callback) {

  const sql = `
    UPDATE products
    SET stock = stock - ?
    WHERE id = ? AND stock >= ?
  `;

  db.query(sql, [quantity, productId, quantity], callback);
}


module.exports = {
  getAllProducts,
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  reduceStock
};