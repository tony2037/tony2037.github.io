import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  SendPeers(symbol:String) {
    symbol = symbol.toUpperCase();
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/peers?symbol=${symbol}`;
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
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/news?symbol=${symbol}&from=${FROM}&to=${TO}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendHistoricalEPS(symbol:String) {
    symbol = symbol.toUpperCase();
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/earnings?symbol=${symbol}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendRecommendationTrends(symbol:String) {
    symbol = symbol.toUpperCase();
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/recommendation?symbol=${symbol}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendInsiderSentiment(symbol:String) {
    symbol = symbol.toUpperCase();
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/insider-sentiment?symbol=${symbol}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendQuote(symbol:String) {
    // FIXME
    symbol = symbol.toUpperCase();
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/quote?symbol=${symbol}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendProfile2(symbol:String){
    // FIXME
    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/profile2?symbol=${symbol}`;
    return this.http.get<any>(api);
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

  SendPortfolioBuy(ticker: string, price: number, quantity: string) {
    const q = parseInt(quantity);
    const payload = { 'ticker': ticker, 'price': price, 'quantity': q };
    return this.http.post<any>(`https://csci-571-assignment3-416903.uw.r.appspot.com/api/portfolio/buy`, payload);
  }

  SendPortfolioSell(ticker: string, price: number, quantity: string) {
    const q = parseInt(quantity);
    const payload = { 'ticker': ticker, 'price': price, 'quantity': q };
    return this.http.post<any>(`https://csci-571-assignment3-416903.uw.r.appspot.com/api/portfolio/sell`, payload);
  }
}
