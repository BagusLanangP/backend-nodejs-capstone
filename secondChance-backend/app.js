const express = require('express');
const cors = require('cors');
require('dotenv').config();

const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');
const searchRoutes = require('./routes/searchRoutes');
// Task 1: Import authRoutes
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3060;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));

// Register Routes
app.use('/api/secondchance/items', secondChanceItemsRoutes);
app.use('/api/secondchance/search', searchRoutes);
// Task 2: Petakan /api/auth ke authRoutes
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
