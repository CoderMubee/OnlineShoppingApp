const productModel = require("../models/productModel");


// ===================== GET PRODUCTS =====================
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

module.exports = {
    getProducts,
    addProduct
};