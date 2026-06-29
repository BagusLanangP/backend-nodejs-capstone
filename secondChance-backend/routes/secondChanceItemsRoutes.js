const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { connectToDatabase } = require('../models/db');

const directoryPath = 'public/images';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const secondChanceItems = await collection.find({}).toArray();
        res.json(secondChanceItems);
    } catch (e) {
        console.error('Something went wrong: ', e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;
        const secondChanceItem = await collection.findOne({ id: id });

        if (!secondChanceItem) {
            return res.status(404).send("secondChanceItem not found");
        }

        res.json(secondChanceItem);
    } catch (e) {
        console.error('Something went wrong: ', e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a new item
router.post('/', upload.single('file'), async(req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const lastItemQuery = await collection.find().sort({'id': -1}).limit(1);
        let secondChanceItem = req.body;

        await lastItemQuery.forEach(item => {
            secondChanceItem.id = (parseInt(item.id) + 1).toString();
        });
        const date_added = Math.floor(new Date().getTime() / 1000);
        secondChanceItem.date_added = date_added;

        const result = await collection.insertOne(secondChanceItem);
        res.status(201).json(secondChanceItem);
    } catch (e) {
        console.error('Something went wrong: ', e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update an existing item
router.put('/:id', async(req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;
        let secondChanceItem = await collection.findOne({ id });

        if (!secondChanceItem) {
            return res.status(404).json({ error: "secondChanceItem not found" });
        }

        secondChanceItem.category = req.body.category;
        secondChanceItem.condition = req.body.condition;
        secondChanceItem.age_days = req.body.age_days;
        secondChanceItem.description = req.body.description;
        secondChanceItem.age_years = Number((secondChanceItem.age_days/365).toFixed(1));
        secondChanceItem.updatedAt = new Date();

        const updatepreloveItem = await collection.findOneAndUpdate(
            { id },
            { $set: secondChanceItem },
            { returnDocument: 'after' }
        );

        if(updatepreloveItem) {
            res.json({"uploaded":"success"});
        } else {
            res.json({"uploaded":"failed"});
        }
    } catch (e) {
        console.error('Something went wrong: ', e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete an existing item
router.delete('/:id', async(req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;
        const secondChanceItem = await collection.findOne({ id });

        if (!secondChanceItem) {
            return res.status(404).json({ error: "secondChanceItem not found" });
        }
        await collection.deleteOne({ id });
        res.json({"deleted":"success"});
    } catch (e) {
        console.error('Something went wrong: ', e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
