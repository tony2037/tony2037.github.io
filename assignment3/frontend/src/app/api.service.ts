import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private POLYGON_API_KEY = "REDACTED_POLYGON_KEY";
  private POLYGON_API_KEY_v2 = "sxcDyjdA5nxbhxVzWkd154nqyLWKjk2C";
  private FINNHUB_API_KEY = "REDACTED_FINNHUB_KEY";

  constructor(private http: HttpClient) { }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  SendPeers(symbol:String) {
    symbol = symbol.toUpperCase();
    const api = `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendNews(symbol:String) {
    // FIXME: change api endpoint and check if we we front 30 days ago
    symbol = symbol.toUpperCase();
    const today = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const FROM: string = this.formatDate(from);
    const TO: string = this.formatDate(today);
    const api = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${FROM}&to=${TO}&token=${this.FINNHUB_API_KEY}`;
    return this.http.get<any>(api);
  }

  SendHistoricalEPS(symbol:String) {
    symbol = symbol.toUpperCase();
    let TODAY = new Date();
    TODAY = new Date(TODAY.getFullYear() - 1, TODAY.getMonth(), TODAY.getDate() - 1);
    const FROM = new Date(TODAY.getFullYear() - 1, TODAY.getMonth(), TODAY.getDate() - 1);
    const TO = TODAY;
    const FROM_STRING = this.formatDate(FROM);
    const TO_STRING = this.formatDate(TO);
    const api = `https://finnhub.io/api/v1/calendar/earnings?from=${FROM_STRING}&to=${TO_STRING}&symbol=${symbol}&token=${this.FINNHUB_API_KEY}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendRecommendationTrends(symbol:String) {
    symbol = symbol.toUpperCase();
    const api = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendInsiderSentiment(symbol:String) {
    symbol = symbol.toUpperCase();
    const api = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=2022-01-01&token=${this.FINNHUB_API_KEY}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

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

  SendWatchlistAdd(ticker: string) {
    ticker = ticker.toUpperCase();
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/watchlist_add?ticker=${ticker}`;
    return this.http.get<any>(api);
  }

  SendWatchlistDel(ticker: string) {
    ticker = ticker.toUpperCase();
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/watchlist_del?ticker=${ticker}`;
    return this.http.get<any>(api);
  }

  SendPortfolioGet() {
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/portfolio/get`;
    return this.http.get<any>(api);
  }
}
