const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");


// CHECKOUT
router.post("/checkout", orderController.checkout);


// GET USER ORDERS
router.get("/details/:userId", orderController.getOrderDetails);
router.get("/:userId", orderController.getOrders);

module.exports = router;