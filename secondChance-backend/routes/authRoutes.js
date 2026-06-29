const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../models/db');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// 1. ENDPOINT REGISTER (Dari Lab Sebelumnya)
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            console.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;
        
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: { id: newUser.insertedId }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        console.log('User registered successfully');
        res.json({ authtoken, email });
    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

// 2. ENDPOINT LOGIN (Task 9 Lanjutan)
router.post('/login', async (req, res) => {
    try {
        // Task 1 & 2: Hubungkan ke DB dan akses koleksi 'users'
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Task 3: Cari kredensial user di database berdasarkan email
        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            // Task 4: Validasi apakah hash password cocok
            let result = await bcryptjs.compare(req.body.password, theUser.password);
            if (!result) {
                console.error('Passwords do not match');
                return res.status(400).json({ error: 'Wrong password' });
            }

            // Task 5: Ambil detail data user dari database
            const userName = theUser.firstName;
            const userEmail = theUser.email;

            // Task 6: Buat JWT token autentikasi dengan payload ID user
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            // Kembalikan respons sukses berupa token, nama, dan email
            return res.json({ authtoken, userName, userEmail });
        } else {
            // Task 7: Berikan pesan kesalahan jika user tidak terdaftar
            console.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }

    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
