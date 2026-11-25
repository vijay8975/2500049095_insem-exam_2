function requireAdmin(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    }

    res.status(401).json({
        message: "Please login as admin first"
    });
}

module.exports = requireAdmin;