const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { isValidUsername, isValidPassword } = require("../utils/authValidation");

const showLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect(req.session.user.role === "Customer" ? "/orders" : "/products");
    }

    res.render("login", { error: null });
};

const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!isValidUsername(username) || !isValidPassword(password)) {
        return res.status(400).render("login", {
            error: "Username hoặc password không đúng định dạng."
        });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).render("login", {
                error: "Username hoặc password không chính xác."
            });
        }

        req.session.regenerate(error => {
            if (error) {
                return next(error);
            }

            req.session.user = {
                id: user._id.toString(),
                username: user.username,
                role: user.role
            };

            req.session.save(saveError => {
                if (saveError) {
                    return next(saveError);
                }

                res.redirect(user.role === "Customer" ? "/orders" : "/products");
            });
        });
    } catch (error) {
        next(error);
    }
};

const logout = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            return next(error);
        }

        res.clearCookie("baitap.sid");
        res.redirect("/login");
    });
};

module.exports = { showLogin, login, logout };
