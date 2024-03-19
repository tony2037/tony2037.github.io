import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

import * as Highcharts from 'highcharts/highstock';
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';
IndicatorsCore(Highcharts)
vbp(Highcharts);

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit , OnDestroy {
  public ticker :any;
  public companyName :string = "";
  public exchangeCode :string = "";
  public lastPrice :number = 0.0;
  public change :number = 0.0;
  public changePercentage :number = 0.0;
  public currentTimestamp :number = 0;
  public currentSecond :string = "";
  public lastTimeStamp :number = 0;
  public lastDay :string = "";
  public highPrice :number = 0.0;
  public lowPrice :number = 0.0;
  public openPrice :number = 0.0;
  public closePrice :number = 0.0;
  public marketStatus :boolean = true;
  public ipoDate :string = "";
  public logoUrl :string = "https://i.imgur.com/NO25iZV.png";
  public webpage :string = "";
  public industry :string = "";
  public currentPosition: number = 0;
  public currentCash: number = 0;
  public peers: string[] = [];

  private POLYGON_API_KEY = "REDACTED_POLYGON_KEY";
  private POLYGON_API_KEY_v2 = "sxcDyjdA5nxbhxVzWkd154nqyLWKjk2C";
  private FINNHUB_API_KEY = "REDACTED_FINNHUB_KEY";

  spinner :boolean = true;
  success :boolean = false;
  loadSummaryChart :boolean = false;
  stockCartQuantity :number = 0;
  stockCartValue :number = 0.0;
  closeResult = '';
  Highcharts!: typeof Highcharts
  chartSummaryOptions!: Highcharts.Options
  chartSummaryData: number[] = [] 
  chartChartOptions!: Highcharts.Options
  chartUpdateFlag :boolean = false;
  chartLoaded :boolean = false;
  bigChartSummaryData: number[] = [];
  bigChartLoaded :boolean = false;
  bigChartUpdateFlag :boolean = false;
  bigChartOptions!: Highcharts.Options;
  recommendationTrendsChartOption!: Highcharts.Options;
  historicalEPSChartOption!: Highcharts.Options;
  ohlc: any[] = [];
  volumes :number[][] = [];
  news: any[] = [];
  totalMSPR: number = 0;
  positiveMSPR: number = 0;
  negativeMSPR: number = 0;
  totalChange: number = 0;
  positiveChange: number = 0;
  negativeChange: number = 0;
  categories: string[] = [];
  strongBuys: number[] = [];
  buys: number[] = [];
  holds: number[] = [];
  sells: number[] = [];
  strongSells :number[] = [];
  seriesData: Highcharts.SeriesOptionsType[] = [];
  watchlist :string[] = [];
  isWatched :boolean = false;
  cash :number = 0;
  quantity :number = 0;

  @ViewChild('num') num: any;

  constructor(private router: Router, private route:ActivatedRoute, 
    private http:HttpClient, private modalService: NgbModal,
    private datePipe: DatePipe, private apiService: ApiService,
    private cdr: ChangeDetectorRef) {
    this.ticker = this.route.snapshot.paramMap.get('ticker');
    if (!this.ticker) {
      this.failCallback();
    }
    this.ticker = this.ticker!.toUpperCase();

    this.buildHighcharts();

    this.apiService.SendProfile2(this.ticker).subscribe((data) => {
      const keys = Object.keys(data);
      if (keys.length == 0) {
        this.failCallback();
      }
      else {
        this.successCallback();
        this.companyName = data.name;
        this.exchangeCode = data.exchange;
        this.ipoDate = data.ipo;
        this.logoUrl = data.logo;
        this.webpage = data.weburl;
        this.industry = data.finnhubIndustry;
      }
    });

    this.apiService.SendQuote(this.ticker).subscribe((data) => {
      const keys = Object.keys(data);
      if (keys.length == 0) {
        this.failCallback();
      }
      else {
        this.successCallback();
        this.lastPrice = data.c;
        this.change = data.d;
        this.changePercentage = parseFloat(data.dp.toFixed(2));
        this.highPrice = data.h;
        this.lowPrice = data.l;
        this.openPrice = data.o;
        this.closePrice = data.pc;
        this.currentTimestamp = Math.floor(Date.now() / 1000);
        this.currentSecond = this.formatTimestamp(this.currentTimestamp, false);
        this.lastTimeStamp = data.t;
        this.lastDay = this.formatTimestamp(this.lastTimeStamp, true);
        const diffInSeconds = this.lastTimeStamp-this.currentTimestamp;
        const diffInHours = diffInSeconds / 3600;
        this.marketStatus = diffInHours < 3;
      }
    });

    this.apiService.SendPeers(this.ticker).subscribe((data) => {
      this.peers = data;
    });

    this.buildNews(this.ticker);

    this.buildInsights(this.ticker);

    this.buildWatchList();

    this.buildPortfolio();
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
  }

  successCallback() {
    this.spinner = false;
    this.success = true;
    console.log('success callbcak');
  }

  failCallback() {
    this.spinner = false;
    this.success = false;
    console.log('fail callbcak');
  }

  buildPortfolio() {
    this.apiService.SendPortfolioGet().subscribe((data) => {
      this.cash = data.cash;
      this.quantity = (this.ticker in data.stocks) ? data.stocks[this.ticker].quantity : 0;
    });
  }

  buildWatchList() {
    this.apiService.SendWatchlistGet().subscribe((data) => {
      data.forEach((ticker: string) => {
        this.watchlist.push(ticker.toUpperCase());
      });
      this.isWatched = this.inWatchlist(this.ticker);
    });
  }

  inWatchlist(ticker: string) :boolean {
    for (let i = 0; i < this.watchlist.length; i++) {
      if (ticker == this.watchlist[i]) {
        return true;
      }
    }
    return false;
  }

  onClickWatchlist() {
    if (this.isWatched) {
      // remove from the watchlist
      this.apiService.SendWatchlistDel(this.ticker).subscribe();
    }
    else {
      // add into watchlist
      this.apiService.SendWatchlistAdd(this.ticker).subscribe();
    }
    this.isWatched = !this.isWatched;
    this.cdr.detectChanges();
  }

  buildInsights(symbol:String) {
    this.apiService.SendInsiderSentiment(symbol).subscribe((data) => {
      interface Element {
        change: number;
        mspr: number;
      }
      this.positiveMSPR = this.negativeMSPR = this.positiveChange = this.negativeChange = 0;
      data.data.forEach((element: Element) => {
        const change = element.change;
        const mspr = element.mspr;
        if (change > 0) {
          this.positiveChange += change;
        }
        else {
          this.negativeChange += change;
        }
        if (mspr > 0) {
          this.positiveMSPR += mspr;
        }
        else {
          this.negativeMSPR += mspr;
        }
      });
      this.positiveChange = parseFloat(this.positiveChange.toFixed(2));
      this.negativeChange = parseFloat(this.negativeChange.toFixed(2));
      this.positiveMSPR = parseFloat(this.positiveMSPR.toFixed(2));
      this.negativeMSPR = parseFloat(this.negativeMSPR.toFixed(2));

      this.totalChange = this.positiveChange + this.negativeChange;
      this.totalMSPR = this.positiveMSPR + this.negativeMSPR;
    });

    this.apiService.SendRecommendationTrends(symbol).subscribe((data) => {
      interface Trend {
        buy: number;
        hold: number;
        period: string;
        sell: number;
        strongBuy: number;
        strongSell: number;
      };
      data.forEach((trend: Trend) => {
        this.categories.push(trend.period);
        this.strongBuys.push(trend.strongBuy);
        this.buys.push(trend.buy);
        this.holds.push(trend.hold);
        this.sells.push(trend.sell);
        this.strongSells.push(trend.strongSell);
      });
      this.recommendationTrendsChartOption = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Recommendation Trends',
            align: 'center'
        },
        xAxis: {
            categories: this.categories
        },
        yAxis: {
            min: 0,
            title: {
                text: '#Analysis'
            },
            stackLabels: {
                enabled: true
            }
        },
        legend: {
            align: 'left',
            x: 70,
            verticalAlign: 'top',
            y: 70,
            floating: true,
            backgroundColor: 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Strong Buy',
            type: 'column',
            data: this.strongBuys
          }, {
              name: 'Buy',
              type: 'column',
              data: this.buys
          }, {
              name: 'Hold',
              type: 'column',
              data: this.holds
          },{
            name: 'Sell',
            type: 'column',
            data: this.sells
          },{
              name: 'Strong Sell',
              type: 'column',
              data: this.strongSells
        }]
      };
    });

    this.apiService.SendHistoricalEPS(symbol).subscribe((data) => {
      interface Entry {
        actual: number;
        estimate: number;
        period: string;
        quarter: number;
        surprise: number;
        surprisePercent: number;
        symbol: string;
        year: number;
      };
      this.seriesData = data.map((entry :Entry) => ({
        name: `Q${entry.quarter} ${entry.year}`,
        data: [[Date.parse(entry.period), entry.actual - entry.estimate]]
      }));

      this.historicalEPSChartOption = {
        chart: {
          type: 'line'
        },
        title: {
          text: 'Quarterly EPS Surprise'
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Date'
          }
        },
        yAxis: {
          title: {
            text: 'EPS Surprise'
          }
        },
        series: this.seriesData,
      };
    });
  }

  buildNews(symbol:String) {
    this.apiService.SendNews(symbol).subscribe((data) => {
      let n = data.length;
      let count = 0;
      for (let i = 0; i < n && count < 8; i++) {
        if (data[i].image.length == 0) continue;
        this.news.push(data[i]);
        count++;
      }
    });
  }

  buildHighcharts() {
    interface Result {
      c: number;
      h: number;
      l: number;
      n: number;
      o: number;
      t: number;
      v: number;
      vw: number;
    }

    interface ApiResponse {
      resultsCount: number;
      results: Result[];
    }

    this.Highcharts = Highcharts;

    this.SendAggs(this.ticker).subscribe((data) => {
      const parsedData: ApiResponse = {
        resultsCount: data.resultsCount,
        results: data.results
      };
      this.ohlc = parsedData.results.map(result => [result.t, result.o, result.h, result.l, result.c]);
      this.volumes = parsedData.results.map(result => [result.t, result.v]);
      // fill the chart options
      this.bigChartLoaded = true;
      this.bigChartUpdateFlag = true;
      this.bigChartOptions = {

        title: {
            text: `${this.ticker} Historical`
        },

        subtitle: {
            text: `With SMA and Volume by Price technical indicators`,
        },

        plotOptions:{
          series:{
            dataGrouping:{
              units:[['week', [1]], ['month', [1,2,3,4,6]]]
            }
          }
        },
        rangeSelector:{
          selected: 2
        },

        tooltip:{
          split:true
        },

        series: [{
          type: 'candlestick',
          name: this.ticker,
          id: 'aapl',
          zIndex: 2,
          data: this.ohlc
        }, {
          type:'column',
          name: 'Volume',
          id:'volume',
          data: this.volumes,
          yAxis: 1
        }, {
          type:'vbp',
          linkedTo:'aapl',
          params:{volumeSeriesID:'volume'},
          dataLabels:{enabled:false},
          zoneLines:{enabled:false}
        }, {
          type:'sma',
          linkedTo:'aapl',
          zIndex:1,
          marker:{enabled:false}
        }],
        yAxis:[{
          startOnTick: false,
          endOnTick: false,
          labels: {align: 'right', x: -3},
          title: {text: 'OHLC'},
          height: '60%',
          lineWidth: 2,
          resize: {enabled: true}
        }, {
          labels: {align: 'right', x: -3},
          title: {text: 'Volume'},
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],
      };
    });

    // FIXME, use hourly data instead
    this.SendAggsHourly(this.ticker).subscribe((data) => {
      const parsedData: ApiResponse = {
        resultsCount: data.resultsCount,
        results: data.results
      };
      const results: number[] = parsedData.results.map(result => result.c);
      this.chartSummaryData = results;

      // fill the chart options
      this.chartLoaded = true;
      this.chartUpdateFlag = true;
      this.chartSummaryOptions = {
        rangeSelector:{
        enabled: false
        },
        title: {
          text: `${this.ticker} Hourly Price Variation`
        },
        series: [{
          data: this.chartSummaryData,
          type: 'line',
          color: 'red',
          name: this.ticker
        }],
        accessibility: {
          enabled: false // for people with difficulty
        }
      }
    });
  }

  waitSeconds(seconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds*1000);
    });
  }

  formatTimestampMdY(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const formattedDate = this.datePipe.transform(date, 'MMMM dd, yyyy');
    return formattedDate || '';
  }

  private formatTimestamp(timestamp: number, onlyday: boolean): string {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return onlyday ? `${year}-${month}-${day}` : `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  SendAggsHourly(symbol:String) {
    symbol = symbol.toUpperCase();
    const TODAY = new Date();
    const FROM = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 2);
    const TO = TODAY;
    const FROM_STRING = this.formatDate(FROM);
    const TO_STRING = this.formatDate(TO);

    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/SendAggsHourly?symbol=${symbol}&from=${FROM_STRING}&to=${TO_STRING}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendAggs(symbol:String) {
    symbol = symbol.toUpperCase();
    const TODAY = new Date();
    const FROM = new Date(TODAY.getFullYear() - 2, TODAY.getMonth(), TODAY.getDate() - 1);
    const TO = TODAY;
    const FROM_STRING = this.formatDate(FROM);
    const TO_STRING = this.formatDate(TO);

    const api = `https://csci-571-assignment3-416903.uw.r.appspot.com/api/SendAggs?symbol=${symbol}&from=${FROM_STRING}&to=${TO_STRING}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  showCash() :string {
    return this.cash.toFixed(2);
  }

  canBuy(price: number, quantity: string) {
    const q = parseInt(quantity);
    const total_price = price * q;
    return total_price <= this.cash;
  }

  BuyStock(ticker: string, price: number, quantity: string, modal: NgbModalRef) {
    const q = parseInt(quantity);
    const total_price = price * q;
    if (this.canBuy(price, quantity)) {
      this.apiService.SendPortfolioBuy(ticker, price, quantity).subscribe();
      this.cash -= total_price;
      this.quantity += q;
      modal.close();
    }
  }

  canSell(quantity: string) {
    const q = parseInt(quantity);
    return q <= this.quantity;
  }

  SellStock(ticker: string, price: number, quantity: string, modal: NgbModalRef) {
    const q = parseInt(quantity);
    const total_price = price * q;
    if (this.canSell(quantity)) {
      this.apiService.SendPortfolioSell(ticker, price, quantity).subscribe();
      this.quantity -= q;
      this.cash += total_price;
      modal.close();
    }
  }

  openModal(content: TemplateRef<any>) {
    this.stockCartQuantity = 0;
    this.stockCartValue = 0;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onKey(quantity: string, curPrice: number) {
    if(quantity == ''){
      quantity = '0';
    }
    quantity = quantity.match(/\d+/g)?.join('') || '0';
    this.stockCartQuantity = parseInt(quantity, 10);
    this.stockCartValue = parseFloat((this.stockCartQuantity * curPrice).toFixed(2));
  }

  reloadAndNavigate(peer: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/search/' + peer]);
    });
  }

}
