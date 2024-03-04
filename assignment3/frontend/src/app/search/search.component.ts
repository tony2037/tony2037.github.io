import { Component, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface StockOption {
  symbol: string;
  description: string;
}

interface AutocompleteOption {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

interface AutocompleteOptions {
  count: number;
  result: AutocompleteOption[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  stockCodeControl = new FormControl();
  filteredOptions: StockOption[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.stockCodeControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(value => {
          this.searchStockOptions(value);
        })
      )
      .subscribe();
  }

  searchStockOptions(query: string): void {
    this.http.get<AutocompleteOptions>(`https://finnhub.io/api/v1/search?q=${query}&token=REDACTED_FINNHUB_KEY`)
      .subscribe(options => {
        this.filteredOptions = [];
        let count = options.count;

        for (let i = 0; i < count; i++) {
          if (options.result[i].type == 'Common Stock' && !options.result[i].symbol.includes('.')) {
            this.filteredOptions.push({symbol: options.result[i].symbol, description: options.result[i].description});
          }
        }
      });
  }

  onOptionSelected(event: any): void {
    this.stockCodeControl.setValue(event.option.value);
  }

  search(): void {
    const stockCode = this.stockCodeControl.value;
    // Perform search action using stockCode
    console.log('Searching for stock:', stockCode);
  }

  clear(): void {
    this.stockCodeControl.reset();
  }
}
