const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Task 1: Import the secondChanceItemsRoutes
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');

const app = express();
const PORT = 3060;

// Middleware dasar untuk parse JSON dan handling CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyediakan akses static folder untuk file gambar yang diunggah
app.use('/images', express.static('public/images'));

// Task 2: Add the secondChanceItemsRoutes to the server using app.use()
app.use('/api/secondchance/items', secondChanceItemsRoutes);

// Jalankan server Express pada port 3060
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});
