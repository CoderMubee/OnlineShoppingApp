const db = require("../connection");

// GET ALL PRODUCTS
function getProducts(callback) {

    const sql = `
        SELECT *
        FROM products
        ORDER BY id DESC
    `;

    db.query(sql, callback);
}


// ADD PRODUCT
function addProduct(values, callback) {

    const sql = `
        INSERT INTO products
        (name, price, image_url, category, description, stock)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, values, callback);
}

module.exports = {
    getProducts,
    addProduct
};