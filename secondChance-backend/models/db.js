const { MongoClient } = require('mongodb');
require('dotenv').config();

// Membaca URL koneksi dari file .env di folder secondChance-backend/
const url = process.env.MONGO_URL;
const dbName = "secondChance";
let dbInstance = null;

async function connectToDatabase() {
    // Jika koneksi sudah ada, kembalikan instansinya (Singleton)
    if (dbInstance) {
        return dbInstance;
    }

    // Task 2: Buat client baru dan hubungkan ke MongoDB
    const client = new MongoClient(url);

    try {
        // Baris wajib untuk kelulusan Task 4
        await client.connect();
        console.log("Connected successfully to MongoDB");

        // Task 3: Hubungkan ke database secondChance dan simpan di dbInstance
        dbInstance = client.db(dbName);

        // Task 4: Kembalikan instansinya
        return dbInstance;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
}

module.exports = { connectToDatabase };