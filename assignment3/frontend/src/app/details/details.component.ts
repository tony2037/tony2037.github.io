import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tick } from '@angular/core/testing';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  private POLYGON_API_KEY = "REDACTED_POLYGON_KEY";
  private FINNHUB_API_KEY = "REDACTED_FINNHUB_KEY";

  spinner :boolean = true;
  success :boolean = false;
  stockCartQuantity :number = 0;
  stockCartValue :number = 0.0;
  closeResult = '';

  constructor(private route:ActivatedRoute, private http:HttpClient, private modalService: NgbModal) {
    this.ticker = this.route.snapshot.paramMap.get('ticker');
    if (!this.ticker) {
      this.failCallback();
    }
    this.ticker = this.ticker!.toUpperCase();

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
        this.marketStatus = diffInHours > 6;
      }
    });

    this.SendAggs(this.ticker).subscribe((data) => {
      const keys = Object.keys(data);
      if (keys.length == 0) {
        this.failCallback();
      }
      else {

      }
    });
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

}
