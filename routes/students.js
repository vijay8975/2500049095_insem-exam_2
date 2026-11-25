const requireAdmin = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Add and view students
router.post("/", requireAdmin, async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.message });
    }
});
router.get("/", async (req, res) => {
    try {
        const filter = {};
        if (req.query.rollNo)
            filter.rollNo = req.query.rollNo;
        if (req.query.department)
            filter.department = req.query.department;

        const students = await Student.find(filter);
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update student
router.put("/:id", requireAdmin, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id, req.body, { new: true, runValidators: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete student
router.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
