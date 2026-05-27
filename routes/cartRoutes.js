const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");


// ADD TO CART
router.post("/add", cartController.addToCart);


// GET CART ITEMS
router.get("/:userId", cartController.getCart);


// CART COUNT
router.get("/count/:userId", cartController.getCartCount);


module.exports = router;