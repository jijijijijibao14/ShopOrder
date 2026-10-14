const mongoose = require("mongoose");
let connectionPromise;

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing. Configure it in the Vercel project environment variables.");
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                console.log("MongoDB connected");
            })
            .catch(error => {
                connectionPromise = null;
                throw error;
            });
    }

    await connectionPromise;
};

module.exports = connectDB;