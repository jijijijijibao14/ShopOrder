const requireRole = role => (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    if (req.session.user.role !== role) {
        return res.status(403).send("You do not have permission to access this page.");
    }

    next();
};

module.exports = { requireRole };
