const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal");

// POST /api/journals
router.post("/", async (req, res) => {
    try {
        const { title, content, date } = req.body;
        const journal = new Journal({ title, content, date });
        await journal.save();
        res.status(201).json(journal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
