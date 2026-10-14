require("dotenv").config();

const express = require("express");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const path = require("node:path");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let sessionMiddlewarePromise;

const getSessionMiddleware = async () => {
    if (!sessionMiddlewarePromise) {
        sessionMiddlewarePromise = (async () => {
            if (!process.env.SESSION_SECRET) {
                throw new Error("SESSION_SECRET is missing. Configure it in the Vercel project environment variables.");
            }

            await connectDB();

            return session({
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
                    secure: process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL),
                    maxAge: 60 * 60 * 1000
                }
            });
        })();
    }

    try {
        return await sessionMiddlewarePromise;
    } catch (error) {
        sessionMiddlewarePromise = null;
        throw error;
    }
};

app.use((req, res, next) => {
    getSessionMiddleware()
        .then(sessionMiddleware => sessionMiddleware(req, res, next))
        .catch(next);
});

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

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    console.error("Request failed:", error);
    res.status(500).send("Server error. Check the Vercel function logs for details.");
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;