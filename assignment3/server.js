const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const FINNHUB_API_KEY = 'REDACTED_FINNHUB_KEY';

app.use(cors());
app.use(express.json());

// Route: /api/autocomplete?query=aapl
app.get('/api/autocomplete', async (req, res) => {
    try {
        let query = req.query.query;
        console.log(`autocomplete: query:${query}`);
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required.' });
        }

        const response = await axios.get(`https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`);

        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
