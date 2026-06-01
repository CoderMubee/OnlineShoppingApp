const express = require("express");
const router = express.Router();

const productController =
  require("../controllers/productController");

const {
  verifyToken,
  requireAdmin
} = require("../config/auth");

//GET ALL PRODUCTS
router.get(
  "/products",
  verifyToken,
  requireAdmin,
  productController.getAllProducts
);
// ADD PRODUCT
router.post(
  "/products",
  verifyToken,
  requireAdmin,
  productController.addProduct
);


// UPDATE PRODUCT
router.put(
  "/products/:id",
  verifyToken,
  requireAdmin,
  productController.updateProduct
);


// DELETE PRODUCT
router.delete(
  "/products/:id",
  verifyToken,
  requireAdmin,
  productController.deleteProduct
);


module.exports = router;