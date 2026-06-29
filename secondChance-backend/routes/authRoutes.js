const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../models/db');
const router = express.Router();
require('dotenv').config();

// Gunakan JWT Secret bawaan lab atau berikan fallback default
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// POST endpoint untuk pendaftaran user baru
router.post('/register', async (req, res) => {
    try {
        // Task 1 & 2: Hubungkan ke DB dan akses koleksi 'users'
        const db = await connectToDatabase();
        const collection = db.collection("users");
        
        // Task 3: Periksa apakah email sudah terdaftar
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            console.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        // Task 4: Buat enkripsi password (hash)
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;
        
        // Task 5: Masukkan user ke database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 6: Buat payload dan tanda tangani token JWT
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        
        // Task 7: Log pendaftaran berhasil
        console.log('User registered successfully');
        
        // Task 8: Kembalikan email dan authtoken dalam format JSON
        res.json({ authtoken, email });
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
