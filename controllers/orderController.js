const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const isValidOrderDate = orderDate => {
    if (typeof orderDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(orderDate)) {
        return false;
    }

    const parsedDate = new Date(`${orderDate}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== orderDate) {
        return false;
    }

    return orderDate >= getTodayDate();
};

// Hiển thị danh sách Order
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        console.log(orders);

        res.render("order", { orders });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Hiển thị form tạo Order
const showCreateOrder = async (req, res) => {
    try {
        const products = await Product.find({
            stockStatus: "in_stock"
        });

        res.render("createOrder", { products, minOrderDate: getTodayDate() });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Thêm Order
const createOrder = async (req, res) => {
    try {
        const { customerName, productName, quantity, orderDate} = req.body;
        if (!isValidOrderDate(orderDate)) {
            return res.status(400).send("Order date must be today or a future date.");
        }

        const product = await Product.findOne({
            productName: productName
        });
        if (!product) {
            return res.status(400).send("Product does not exist");
        }
        const totalPrice = product.unitPrice * Number(quantity);

        await Order.create({
            customerName,
            productName,
            quantity,
            orderDate,
            totalPrice
        });

        res.redirect("/orders");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteOrder = async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.redirect("/orders");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const showUpdateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        const products = await Product.find({ stockStatus: "in_stock" });

        if (!order) {
            return res.status(404).send("Order not found");
        }
        res.render("updateOrder", {
            order,
            products,
            minOrderDate: getTodayDate()
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateOrder = async (req, res) => {
    try {
        const { customerName, productName, quantity, orderDate} = req.body;
        if (!isValidOrderDate(orderDate)) {
            return res.status(400).send("Order date must be today or a future date.");
        }

        const product = await Product.findOne({ productName: productName});

        if (!product) {
            return res.status(400).send("Product does not exist");
        }

        const totalPrice = product.unitPrice * Number(quantity);

        await Order.findByIdAndUpdate(
            req.params.id,
            {
                customerName,
                productName,
                quantity,
                orderDate,
                totalPrice
            },
            { new: true }
        );

        res.redirect("/orders");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getOrders,
    showCreateOrder,
    createOrder,
    deleteOrder,
    showUpdateOrder,
    updateOrder,
    isValidOrderDate,
    getTodayDate
};