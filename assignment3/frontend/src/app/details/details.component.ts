import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  ohlc: any[] = [];
  volumes: number[] = [];
  news: any[] = [];

  constructor(private router: Router, private route:ActivatedRoute, 
    private http:HttpClient, private modalService: NgbModal,
    private datePipe: DatePipe) {
    this.ticker = this.route.snapshot.paramMap.get('ticker');
    if (!this.ticker) {
      this.failCallback();
    }
    this.ticker = this.ticker!.toUpperCase();

    this.buildHighcharts();

    this.SendProfile2(this.ticker).subscribe((data) => {
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

    this.SendQuote(this.ticker).subscribe((data) => {
      const keys = Object.keys(data);
      if (keys.length == 0) {
        this.failCallback();
      }
      else {
        this.successCallback();
        this.lastPrice = data.c;
        this.change = data.d;
        this.changePercentage = data.dp;
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

    this.SendPeers(this.ticker).subscribe((data) => {
      this.peers = data;
    });

    this.buildNews(this.ticker);
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

  buildNews(symbol:String) {
    this.SendNews(symbol).subscribe((data) => {
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
      this.ohlc = parsedData.results.map(result => [result.v, result.o, result.h, result.l, result.c]);
      this.volumes = parsedData.results.map(result => result.v);
      // fill the chart options
      this.bigChartLoaded = true;
      console.log(this.ohlc);
      console.log(this.volumes);
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

  SendPeers(symbol:String) {
    symbol = symbol.toUpperCase();
    const api = `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendAggsHourly(symbol:String) {
    symbol = symbol.toUpperCase();
    const NOW: number = Date.now();
    const SIX_HOURS_IN_MS: number = 6 * 60 * 60 * 1000;
    const FROM: number = NOW - SIX_HOURS_IN_MS;

    const api = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/minute/${FROM}/${NOW}?adjusted=true&sort=asc&apiKey=${this.POLYGON_API_KEY_v2}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendAggs(symbol:String) {
    symbol = symbol.toUpperCase();
    const TODAY = new Date();
    const FROM = new Date(TODAY.getFullYear(), TODAY.getMonth() - 6, TODAY.getDate() - 1);
    const TO = TODAY;
    const FROM_STRING = this.formatDate(FROM);
    const TO_STRING = this.formatDate(TO);
    const api = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${FROM_STRING}/${TO_STRING}?adjusted=true&sort=asc&apiKey=${this.POLYGON_API_KEY}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendQuote(symbol:String) {
    // FIXME
    const api = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`;
    console.log(`call api: ${api}`);
    return this.http.get<any>(api);
  }

  SendProfile2(symbol:String){
    // FIXME
    return this.http.get<any>(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`);
  }

  buyit(quantity: string, curPrice: number) {
    if(quantity == ''){
      quantity = '0';
    }
    quantity = quantity.match(/\d+/g)?.join('') || '0';
    this.stockCartQuantity = parseInt(quantity, 10);
    this.stockCartValue = parseFloat((this.stockCartQuantity * curPrice).toFixed(2));
    console.log(`bug ${this.stockCartQuantity} x ${curPrice}  = ${this.stockCartValue}`);
  }

  sellit() {

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
