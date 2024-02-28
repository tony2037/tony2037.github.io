const https = require('https');

FINNHUB_API_KEY = 'REDACTED_FINNHUB_KEY';
POLYGON_API_KEY = 'REDACTED_POLYGON_KEY';

const defaultCallback = (data)=>{console.log(data)};

function apiCall(url, callback = defaultCallback) {
    const request = https.get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', (chunk) => {
            data = JSON.parse(data);
            callback(data);
        });
    });
    request.on('error', (error) => {
        console.error(error);
    });
    request.end();
}

function apiAutoComplete(query, callback = defaultCallback) {
    api = `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`;
    console.log(`Performe AutoComplete: ${api}`);
    apiCall(api, callback);
}
module.exports = {
    apiAutoComplete
};