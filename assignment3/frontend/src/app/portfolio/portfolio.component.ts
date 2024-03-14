import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { forkJoin, tap } from 'rxjs';
import { tick } from '@angular/core/testing';

interface Stock {
  company_name: string;
  ticker: string;
  total: number;
  quantity: number;
  avg_cost: number;
  change: number;
  current_price: number;
  market_value: number;
};

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit , OnDestroy {

  cash :number = 0.0;
  stocks :Stock[] = [];

  constructor(private router: Router, private route:ActivatedRoute, 
    private http:HttpClient, private modalService: NgbModal,
    private datePipe: DatePipe, private apiService: ApiService) {
      this.BuildPortfolio();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  BuildPortfolio() {
    this.apiService.SendPortfolioGet().subscribe((data) => {
      this.cash = data.cash;
  
      const observables = [];
      for (const ticker in data.stocks) {
        const stock = data.stocks[ticker];
        const quoteObservable = this.apiService.SendQuote(ticker);
        const profileObservable = this.apiService.SendProfile2(ticker);
        
        observables.push(forkJoin([quoteObservable, profileObservable]).pipe(
          tap(([quoteData, profileData]) => {
            const company_name = profileData.name;
            const total = stock.total;
            const quantity = stock.quantity;
            const avg_cost = parseFloat((total / quantity).toFixed(2));
            const change = quoteData.d;
            const current_price = quoteData.c;
            const market_value = parseFloat((current_price * quantity).toFixed(2));
  
            this.stocks.push({
              company_name: company_name,
              ticker: ticker,
              total: total,
              quantity: quantity,
              avg_cost: avg_cost,
              change: change,
              current_price: current_price,
              market_value: market_value
            });
          })
        ));
      }
  
      forkJoin(observables).subscribe(() => {
      });
    });
  }
}
