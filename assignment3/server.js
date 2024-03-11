const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const fs = require('node:fs');
const { MongoClient, ServerApiVersion } = require('mongodb');

const FINNHUB_API_KEY = 'REDACTED_FINNHUB_KEY';

const dbName = 'Assigntment3DB';
const collectionWatchlist = 'watchlist';
async function run() {
    fs.readFile('.password', 'utf-8', (err, password) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(password);
        const uri = `mongodb+srv://ztex030640417:${password}@cluster0.zpk5y5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
        console.log(uri);
        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();
        // Send a ping to confirm a successful connection
        client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    });
}

run().catch(console.error);

app.use(cors());
app.use(express.json());

// Route: /api/watchlist_drop
app.get('/api/watchlist_drop', async (req, res) => {
    try {
        const db = client.db(dbName);
        const result = await db.dropCollection(collectionWatchlist);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/watchlist_del?ticker=AAPL
app.get('/api/watchlist_del', async (req, res) => {
    try {
        const ticker = req.query.ticker.toUpperCase();
        const db = client.db(dbName);
        const collection = db.collection(collectionWatchlist);
        const result = await collection.updateOne({}, { $pull: { watchlist: ticker } });
        if (result.modifiedCount > 0) {
            console.log(`Removed ${ticker} from watchlist`);
            res.status(200).send(`Removed ${ticker} from watchlist`);
        } else {
            console.log(`${ticker} not found in watchlist`);
            res.status(404).send(`${ticker} not found in watchlist`);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/watchlist_add?ticker=AAPL
app.get('/api/watchlist_add', async (req, res) => {
    try {
        const ticker = req.query.ticker.toUpperCase();
        const db = client.db(dbName);
        const collection = db.collection(collectionWatchlist);
        await db.createCollection(collectionWatchlist);

        const result = await collection.updateOne({}, { $addToSet: { watchlist: ticker } }, { upsert: true });

        if (result.modifiedCount > 0) {
            res.status(200).send(`Added ${ticker} to watchlist`);
        } else {
            res.status(400).send(`${ticker} already exists in watchlist`);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

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
