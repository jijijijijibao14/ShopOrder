const express = require("express");
const { requireRole } = require("../middleware/auth");
const {
    getProducts,
    showCreateProduct,
    createProduct,
    showUpdateProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

router.use(requireRole("Saler"));
router.get("/", getProducts);
router.get("/create", showCreateProduct);
router.post("/create", createProduct);
router.get("/update/:id", showUpdateProduct);
router.post("/update/:id", updateProduct);
router.post("/delete/:id", deleteProduct);

module.exports = router;
