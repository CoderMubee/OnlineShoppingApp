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

// UPDATE QUANTITY
function updateCart(req, res) {

  const { user_id, product_id, quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      message: "Invalid quantity"
    });
  }

  cartModel.updateCart(
    user_id,
    product_id,
    quantity,
    (err) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database error"
        });
      }

      res.json({
        message: "Cart updated"
      });

    }
  );
}


// REMOVE ITEM
function removeItem(req, res) {

  const { user_id, product_id } = req.body;

  cartModel.removeItem(
    user_id,
    product_id,
    (err) => {

      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database error"
        });
      }

      res.json({
        message: "Item removed"
      });

    }
  );
}


// GET CART COUNT
function getCartCount(req, res) {
  const { userId } = req.params;

  cartModel.getCartCount(userId, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    res.json({ total: result[0] || 0 });
  });
}

module.exports = {
  addToCart,
  getCart,
  getCartCount,
  updateCart,
  removeItem
};