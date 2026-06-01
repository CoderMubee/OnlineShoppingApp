const db = require("../connection");
const orderModel = require("../models/orderModel");


// CHECKOUT (CREATE ORDER)
function checkout(req, res) {
  const { user_id } = req.body;

  // STEP 1: GET CART ITEMS
  const cartSql = `
    SELECT 
      cart.product_id,
      cart.quantity,
      products.price
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(cartSql, [user_id], (err, cartItems) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // STEP 2: CALCULATE TOTAL
    let total = 0;

    cartItems.forEach(item => {
      total += item.price * item.quantity;
    });

    // STEP 3: CREATE ORDER
    orderModel.createOrder(user_id, total, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Order failed" });
      }

      const orderId = result.insertId;

      // STEP 4: PREPARE ORDER ITEMS
      const values = cartItems.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      // STEP 5: INSERT ORDER ITEMS
      orderModel.createOrderItems(values, (err2) => {
        if (err2) {
          return res.status(500).json({ message: "Order items failed" });
        }

        // STEP 6: CLEAR CART
        const clearSql = `
          DELETE FROM cart WHERE user_id = ?
        `;

        db.query(clearSql, [user_id], (err3) => {
          if (err3) {
            return res.status(500).json({ message: "Cart clear failed" });
          }

          res.json({ message: "Checkout successful" });
        });
      });
    });
  });
}


// GET USER ORDERS
function getOrders(req, res) {
  const { userId } = req.params;

  orderModel.getOrdersByUser(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });
}
//order details
function getOrderDetails(req, res) {

  const { userId } = req.params;

  orderModel.getOrderDetails(userId, (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "DB error"
      });
    }

    res.json(result);

  });

}

module.exports = {
  checkout,
  getOrders,
  getOrderDetails
  
};