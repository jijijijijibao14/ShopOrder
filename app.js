require("dotenv").config();

const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startServer = async () => {
    if (!process.env.SESSION_SECRET) {
        throw new Error("SESSION_SECRET must be set in the environment");
    }

    await connectDB();

    app.use(session({
        name: "baitap.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            clientPromise: Promise.resolve(mongoose.connection.getClient()),
            collectionName: "sessions"
        }),
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000
        }
    }));

    app.use((req, res, next) => {
        res.locals.currentUser = req.session.user || null;
        next();
    });

    app.use("/", authRoutes);
    app.use("/orders", orderRoutes);
    app.use("/products", productRoutes);

    app.get("/", (req, res) => {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        res.redirect(req.session.user.role === "Customer" ? "/orders" : "/products");
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

startServer().catch(error => {
    console.error("Server startup error:", error.message);
    process.exit(1);
});