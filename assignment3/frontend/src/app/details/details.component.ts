import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit , OnDestroy {
  public ticker :any;
  spinner :boolean = true;
  success :boolean = false;

  constructor(private route:ActivatedRoute, private http:HttpClient) {
    let ticker = this.route.snapshot.paramMap.get('ticker');
    if (!ticker) {
      this.failCallback();
    }
    ticker = ticker!.toUpperCase();

    this.SendProfile2(ticker).subscribe((data) => {
      const keys = Object.keys(data);
      if (keys.length == 0) {
        this.failCallback();
      }
      else {
        this.successCallback();
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

  SendProfile2(symbol:String){
    // FIXME
    return this.http.get<any>(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=REDACTED_FINNHUB_KEY`);
  }

}
