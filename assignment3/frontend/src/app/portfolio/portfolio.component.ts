import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { forkJoin, tap } from 'rxjs';
import { tick } from '@angular/core/testing';

interface Stock {
  ticker: string;
  total: number;
  quantity: number;
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
      for (const ticker in data.stocks) {
        let stock = data.stocks[ticker];
        this.stocks.push({
          ticker: ticker,
          total: stock.total,
          quantity: stock.quantity
        });
      }
    });
  }
}
