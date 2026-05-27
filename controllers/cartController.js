const cartModel = require("../models/cartModel");


// ADD TO CART
function addToCart(req, res) {
  const { user_id, product_id, quantity } = req.body;

  cartModel.addToCart(user_id, product_id, quantity, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Added to cart" });
  });
}


// GET CART ITEMS
function getCart(req, res) {
  const { userId } = req.params;

  cartModel.getCartByUser(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });
}


// GET CART COUNT
function getCartCount(req, res) {
  const { userId } = req.params;

  cartModel.getCartCount(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    res.json({ total: result[0].total || 0 });
  });
}

module.exports = {
  addToCart,
  getCart,
  getCartCount
};