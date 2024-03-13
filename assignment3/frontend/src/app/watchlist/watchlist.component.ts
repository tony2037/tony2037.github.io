import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { forkJoin, tap } from 'rxjs';

interface StockCard {
  ticker: string;
  companyName: string;
  price: number;
  change: number;
  changePercentage: number;
};

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit , OnDestroy {

  watched_stocks: StockCard[] = [];

  constructor(private router: Router, private route:ActivatedRoute, 
    private http:HttpClient, private modalService: NgbModal,
    private datePipe: DatePipe, private apiService: ApiService) {
      this.BuildCards();
    }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      
  }

  BuildCards() {
    this.apiService.SendWatchlistGet().subscribe((data) => {
      const observables = data.map((ticker: string) => {
        ticker = ticker.toUpperCase();
        return forkJoin([
          this.apiService.SendQuote(ticker),
          this.apiService.SendProfile2(ticker)
        ]).pipe(
          tap(([quoteData, profileData]) => {
            const stockCard: StockCard = {
              ticker: ticker,
              companyName: profileData.name,
              price: quoteData.c,
              change: quoteData.d,
              changePercentage: quoteData.dp
            };
            this.watched_stocks.push(stockCard);
          })
        );
      });
      forkJoin(observables).subscribe(() => {
        
      });
    });
  }
}
