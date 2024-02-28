const https = require('https');

FINNHUB_API_KEY = 'REDACTED_FINNHUB_KEY';
POLYGON_API_KEY = 'REDACTED_POLYGON_KEY';


function apiAutoComplete(query, callback = (data)=>{console.log(data)}) {
    api = `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`;
    console.log(`Performe AutoComplete: ${api}`);
    const request = https.get(api, (res) => {
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
module.exports = {
    apiAutoComplete
};