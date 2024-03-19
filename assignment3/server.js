const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const fs = require('node:fs');
const { MongoClient, ServerApiVersion, Double } = require('mongodb');

const FINNHUB_API_KEY = 'REDACTED_FINNHUB_KEY';
const POLYGON_API_KEY = 'REDACTED_POLYGON_KEY';
const POLYGON_API_KEY_v2 = 'sxcDyjdA5nxbhxVzWkd154nqyLWKjk2C';

const { dbPassword } = require('./password');
const uri = `mongodb+srv://ztex030640417:${dbPassword}@cluster0.zpk5y5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = 'Assigntment3DB';
const collectionWatchlist = 'watchlist';
const collectionPortfolio = 'portfolio';

app.use(cors());
app.use(express.json());

// Route: /api/SendAggs?symbol=aapl&from=2022-03-18&to=2024-03-18
app.get('/api/SendAggs', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();
        const from = req.query.from;
        const to = req.query.to;

        if (!symbol || !from || !to) {
            return res.status(400).json({ error: 'parameters is required.' });
        }

        const api = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`;
        console.log(api);
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/SendAggsHourly?symbol=aapl&from=2024-03-16&to=2024-03-18
app.get('/api/SendAggsHourly', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();
        const from = req.query.from;
        const to = req.query.to;

        if (!symbol || !from || !to) {
            return res.status(400).json({ error: 'parameters is required.' });
        }

        const api = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/hour/${from}/${to}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY_v2}`;
        console.log(api);
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/profile2?symbol=${symbol}
app.get('/api/profile2', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();

        if (!symbol) {
            return res.status(400).json({ error: 'parameters is required.' });
        }

        const api = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        console.log(api);
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/quote?symbol=${symbol}
app.get('/api/quote', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();

        if (!symbol) {
            return res.status(400).json({ error: 'parameters is required.' });
        }

        const api = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        console.log(api);
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/insider-sentiment?symbol=${symbol}
app.get('/api/insider-sentiment', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();

        if (!symbol) {
            return res.status(400).json({ error: 'parameters is required.' });
        }

        const api = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&token=${FINNHUB_API_KEY}`;
        console.log(api);
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/recommendation?symbol=${symbol}
app.get('/api/recommendation', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();

        if (!symbol) {
            return res.status(400).json({ error: 'parameters is required.' });
        }

        const api = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        console.log(api);
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/earnings?symbol=${symbol}
app.get('/api/earnings', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();

        if (!symbol) {
            return res.status(400).json({ error: 'parameters is required.' });
        }

        const api = `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        console.log(api);
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/news?symbol=${symbol}&from=${from}&to=${to}
app.get('/api/news', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();
        const from = req.query.from;
        const to = req.query.to;

        if (!symbol || !from || !to) {
            return res.status(400).json({ error: 'parameters is required.' });
        }

        const api = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`;
        console.log(api);
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/peers?symbol=AAPL
app.get('/api/peers', async (req, res) => {
    try {
        const symbol = req.query.symbol.toUpperCase();
        console.log(`peers: symbol:${symbol}`);

        if (!symbol) {
            return res.status(400).json({ error: 'symbol parameter is required.' });
        }
        const api = `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const response = await axios.get(api);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

app.get('/api/portfolio/get', async (req, res) => {
    let client;
    try {
        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionPortfolio);
        const result = await collection.findOne({});
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
});


app.post('/api/portfolio/init', async (req, res) => {
    try {
        const cash = req.body.cash;
        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        client.connect();
        client.db("admin").command({ ping: 1 });
        const db = client.db(dbName);
        const collection = db.collection(collectionPortfolio);

        // Check if portfolio document already exists
        const existingPortfolio = await collection.findOne({});
        if (existingPortfolio) {
            // Update cash in existing portfolio
            await collection.updateOne({}, { $set: { cash: cash, stocks: {} } });
            res.status(200).send('Portfolio cash updated successfully.');
        } else {
            // Create new portfolio document
            await collection.insertOne({ cash: cash, stocks: {} });
            res.status(200).send('Portfolio initialized successfully.');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while initializing portfolio.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

app.post('/api/portfolio/buy', async (req, res) => {
    try {
        const { ticker, price, quantity } = req.body;
        const cost = price * quantity;

        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        client.connect();
        client.db("admin").command({ ping: 1 });
        const db = client.db(dbName);
        const collection = db.collection(collectionPortfolio);

        const result = await collection.findOne({});
        if (!result) {
            await collection.insertOne({
                cash: 2000000,
                stocks: {}
            });
        }

        const updateResult = await collection.updateOne({}, {
            $inc: {
                cash: -cost,
                [`stocks.${ticker}.total`]: cost,
                [`stocks.${ticker}.quantity`]: quantity
            }
        });

        const updatedCollection = await collection.findOne({});

        if (!updatedCollection) {
            return res.status(500).json({ error: 'Failed to retrieve updated collection.' });
        }

        res.json(updatedCollection);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while buying stock.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

app.post('/api/portfolio/sell', async (req, res) => {
    try {
        const { ticker, p, q } = req.body;
        const price = parseFloat(p);
        const quantity = parseInt(q);
        const income = price * quantity;

        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        client.connect();
        client.db("admin").command({ ping: 1 });
        const db = client.db(dbName);
        const collection = db.collection(collectionPortfolio);

        const result = await collection.findOne({});

        if (!result || !result.stocks || !result.stocks[ticker] || result.stocks[ticker].quantity < quantity) {
            return res.status(400).json({ error: 'Insufficient stocks to sell.' });
        }

        const updateResult = await collection.updateOne({}, {
            $inc: {
                cash: income,
                [`stocks.${ticker}.total`]: -income,
                [`stocks.${ticker}.quantity`]: -quantity
            }
        });

        const updatedCollection = await collection.findOne({});

        if (!updatedCollection) {
            return res.status(500).json({ error: 'Failed to retrieve updated collection.' });
        }

        res.json(updatedCollection);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while selling stock.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

// Route: /api/watchlist_drop
app.get('/api/watchlist_drop', async (req, res) => {
    let client;
    try {
        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        client.connect();
        client.db("admin").command({ ping: 1 });
        const db = client.db(dbName);
        const collection = db.collection(collectionWatchlist);
        const result = await collection.deleteMany({});
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route: /api/watchlist_get
app.get('/api/watchlist_get', async (req, res) => {
    let client;
    try {
        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        const db = client.db(dbName);

        const collectionExists = await db.listCollections({ name: collectionWatchlist }).hasNext();
        if (!collectionExists) {
            return res.json([]);
        }

        const collection = db.collection(collectionWatchlist);
        const result = await collection.findOne({});

        if (!result || !result.watchlist) {
            return res.json([]);
        }

        res.json(result.watchlist);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    } finally {
        if (client) {
            await client.close();
        }
    }
});


// Route: /api/watchlist_del?ticker=AAPL
app.get('/api/watchlist_del', async (req, res) => {
    let client;
    try {
        const ticker = req.query.ticker.toUpperCase();

        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        client.connect();
        client.db("admin").command({ ping: 1 });
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
    let client;
    try {
        const ticker = req.query.ticker.toUpperCase();

        client = new MongoClient(uri, {
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        });
        client.connect();
        client.db("admin").command({ ping: 1 });
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
