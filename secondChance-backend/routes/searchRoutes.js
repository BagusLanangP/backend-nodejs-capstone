const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../models/db');
require('dotenv').config();

// Search for items
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        
        // Initialize the query object
        let query = {};

        // Task 2: Check if the name exists and is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" }; // Partial match, case-insensitive
        }

        // Task 3: Add the remaining three filters to the query
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }

        // Task 4: Fetch filtered items
        const items = await collection.find(query).toArray();
        res.json(items);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
