require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const { isValidUsername, isValidPassword } = require("../utils/authValidation");

const accounts = [
    {
        role: "Customer",
        username: process.env.CUSTOMER_USERNAME,
        password: process.env.CUSTOMER_PASSWORD
    },
    {
        role: "Saler",
        username: process.env.SALER_USERNAME,
        password: process.env.SALER_PASSWORD
    }
];

const seedUsers = async () => {
    for (const account of accounts) {
        if (!isValidUsername(account.username)) {
            throw new Error(`${account.role} username must be at least 7 alphanumeric characters`);
        }
        if (!isValidPassword(account.password)) {
            throw new Error(`${account.role} password must be 8+ characters with lowercase, uppercase, and a number`);
        }
    }

    if (accounts[0].username === accounts[1].username) {
        throw new Error("Customer and Saler usernames must be different");
    }

    await connectDB();

    for (const account of accounts) {
        const passwordHash = await bcrypt.hash(account.password, 12);
        await User.findOneAndUpdate(
            { username: account.username },
            { $set: { passwordHash, role: account.role } },
            { upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        console.log(`Seeded ${account.role} account: ${account.username}`);
    }
};

seedUsers()
    .catch(error => {
        console.error("Unable to seed users:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
