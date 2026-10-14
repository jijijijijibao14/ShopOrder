const Product = require("../models/productModel");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ productName: 1 });
        res.render("products", { products });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const showCreateProduct = (req, res) => {
    res.render("createProduct");
};

const showUpdateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.render("updateProduct", { product });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).send("Product not found");
        }
        res.status(500).send(error.message);
    }
};

const createProduct = async (req, res) => {
    try {
        const { productName, category, stockStatus, unitPrice, tags } = req.body;

        await Product.create({
            productName,
            category,
            stockStatus,
            unitPrice,
            tags: tags ? tags.split(",").map(tag => tag.trim()) : []
        });

        res.redirect("/products");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { productName, category, stockStatus, unitPrice, tags } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                productName,
                category,
                stockStatus,
                unitPrice,
                tags: tags ? tags.split(",").map(tag => tag.trim()) : []
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.redirect("/products");
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).send("Product not found");
        }
        res.status(500).send(error.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        res.redirect("/products");
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(404).send("Product not found");
        }
        res.status(500).send(error.message);
    }
};

module.exports = {
    getProducts,
    showCreateProduct,
    createProduct,
    showUpdateProduct,
    updateProduct,
    deleteProduct
};
