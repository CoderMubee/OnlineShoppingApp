const productModel = require("../models/productModel");

// ===================== GET ALL PRODUCTS (admin)=====================
function getAllProducts(req, res) {

    productModel.getAllProducts((err, result) => {

        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        res.json(result);
    });
}

// ===================== GET PRODUCTS (public) =====================
function getProducts(req, res) {

    productModel.getProducts((err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        res.status(200).json(result);

    });

}


// ===================== GET PRODUCT BY ID =====================
function getProductById(req, res) {

    const { id } = req.params;

    productModel.getProductById(id, (err, result) => {

        if (err) {

            return res.status(500).json({
                message: "Database error"
            });

        }

        if (result.length === 0) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json(result[0]);

    });

}


// ===================== ADD PRODUCT =====================
function addProduct(req, res) {

    const {
        name,
        price,
        image_url,
        category,
        description,
        stock
    } = req.body;

    if (!name || !price) {

        return res.status(400).json({
            message: "Missing required fields"
        });

    }

    const values = [
        name,
        price,
        image_url,
        category || null,
        description || null,
        stock || 0
    ];

    productModel.addProduct(values, (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });

        }

        return res.status(201).json({
            message: "Product added successfully"
        });

    });

}


// ===================== UPDATE PRODUCT =====================
function updateProduct(req, res) {

    const { id } = req.params;

    const {
        name,
        price,
        image_url,
        category,
        description,
        stock
    } = req.body;

    const values = [
        name,
        price,
        image_url,
        category,
        description,
        stock
    ];

    productModel.updateProduct(id, values, (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });

        }

        res.json({
            message: "Product updated successfully"
        });

    });

}


// ===================== DELETE PRODUCT =====================
function deleteProduct(req, res) {

    const { id } = req.params;

    productModel.deleteProduct(id, (err) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });

        }

        res.json({
            message: "Product deleted successfully"
        });

    });

}


module.exports = {
    getAllProducts,
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};