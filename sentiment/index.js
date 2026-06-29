require('dotenv').config();
const express = require('express');
const axios = require('axios');

// Task 1: Import the Natural library
const natural = require("natural");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Task 3: Create a POST /sentiment endpoint
app.post('/sentiment', async (req, res) => {
    // Task 4: Extract the sentence parameter from the request query string
    const { sentence } = req.query;

    if (!sentence) {
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with Natural's PorterStemmer and English language
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    try {
        // Perform sentiment analysis
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        // Task 5: Process the response from Natural by adding a sentiment type
        let sentiment = "neutral";

        if (analysisResult < 0) {
            sentiment = "negative";
        } else if (analysisResult > 0.33) {
            sentiment = "positive";
        }

        // Task 6: Implement success return state
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        // Task 7: Implement error return state
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
