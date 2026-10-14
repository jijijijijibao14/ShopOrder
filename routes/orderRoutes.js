const express = require("express");

const router = express.Router();

const { requireRole } = require("../middleware/auth");
const { getOrders, showCreateOrder, createOrder, deleteOrder, showUpdateOrder, updateOrder } = require("../controllers/orderController");

router.use(requireRole("Customer"));
router.get("/", getOrders);
router.get("/create", showCreateOrder);
router.post("/create", createOrder);
router.post("/delete/:id", deleteOrder);
router.get("/update/:id", showUpdateOrder);
router.post("/update/:id", updateOrder);

module.exports = router;