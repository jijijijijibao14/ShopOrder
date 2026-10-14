const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Za-z0-9]{7,}$/
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Customer", "Saler"],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
//Customer: Username customer01, Password CustomerPass123
//Saler: Username saler001, Password SalerPass123