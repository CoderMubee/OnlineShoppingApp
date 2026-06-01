const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const {
    verifyToken,
    requireAdmin
} = require("../config/auth");


// ADD PRODUCT
router.post(
    "/products",
    verifyToken,
    requireAdmin,
    productController.addProduct
);

module.exports = router;