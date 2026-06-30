const db = require("../connection");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");

// CHECKOUT (CREATE ORDER)
function checkout(req, res) {

  const { user_id } = req.body;

  // STEP 1: GET CART ITEMS
  cartModel.getCartByUser(user_id, (err, cartItems) => {

    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // STEP 2: VALIDATE STOCK
    for (let item of cartItems) {
      if (item.quantity > item.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}`
        });
      }
    }

    // STEP 3: CALCULATE TOTAL
    let total = 0;

    cartItems.forEach(item => {
      total += Number(item.price) * Number(item.quantity);
    });

    // STEP 4: CREATE ORDER
    orderModel.createOrder(user_id, total, (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Order failed" });
      }

      const orderId = result.insertId;

      // STEP 5: CREATE ORDER ITEMS
      const values = cartItems.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      orderModel.createOrderItems(values, (err2) => {

        if (err2) {
          return res.status(500).json({ message: "Order items failed" });
        }

        // STEP 6: REDUCE STOCK SAFELY
        let completed = 0;

        for (let item of cartItems) {

          productModel.reduceStock(
            item.product_id,
            item.quantity,
            (err3, result) => {

              if (err3) {
                return res.status(500).json({
                  message: "Stock update failed"
                });
              }

              // IMPORTANT SAFETY CHECK
              if (result.affectedRows === 0) {
                return res.status(400).json({
                  message: `Out of stock: ${item.name}`
                });
              }

              completed++;

              // STEP 7: WHEN ALL DONE → CLEAR CART
              if (completed === cartItems.length) {

                cartModel.clearCart(user_id, (err4) => {

                  if (err4) {
                    return res.status(500).json({
                      message: "Cart clear failed"
                    });
                  }

                  return res.json({
                    message: "Checkout successful"
                  });

                });
              }
            }
          );
        }
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