import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private POLYGON_API_KEY = "REDACTED_POLYGON_KEY";
  private POLYGON_API_KEY_v2 = "sxcDyjdA5nxbhxVzWkd154nqyLWKjk2C";
  private FINNHUB_API_KEY = "REDACTED_FINNHUB_KEY";

  constructor(private http: HttpClient) { }

  SendQuote(symbol:String) {
    // FIXME
    symbol = symbol.toUpperCase();
    const api = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendProfile2(symbol:String){
    // FIXME
    symbol = symbol.toUpperCase();
    return this.http.get<any>(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`);
  }

  SendWatchlistGet() {
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/watchlist_get`;
    return this.http.get<any>(api);
  }

  SendPortfolioGet() {
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/portfolio/get`;
    return this.http.get<any>(api);
  }
}
