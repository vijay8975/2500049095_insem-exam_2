const express = require("express");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });

        if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        req.session.regenerate(err => {
            if (err) {
                return res.status(500).json({ message: "Login failed" });
            }

            req.session.adminId = admin._id.toString();
            req.session.username = admin.username;

            req.session.save(err => {
                if (err) {
                    return res.status(500).json({ message: "Session error" });
                }

                res.json({ message: "Login successful" });
            });
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Check login status
router.get("/me", (req, res) => {
    if (req.session.adminId) {
        return res.json({
            loggedIn: true,
            username: req.session.username
        });
    }

    res.json({ loggedIn: false });
});

// Admin logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }

        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
});

module.exports = router;