import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'frontend';
  isCollapsed = true;
  
  onClickSearch() {
    this.isCollapsed = !this.isCollapsed;
    let searchButton = document.getElementById('search-button');
    let watchlistButton = document.getElementById('watchlist-button');
    let portfolioButton = document.getElementById('portfolio-button');
    let searchLink = document.getElementById('search-link');
    let watchlistLink = document.getElementById('watchlist-link');
    let portfolioLink = document.getElementById('portfolio-link');
    watchlistButton!.style.border = 'none';
    portfolioButton!.style.border = 'none';
    searchButton!.style.border = 'white solid';
    searchLink!.style.color = 'white';
    watchlistLink!.removeAttribute('style');
    portfolioLink!.removeAttribute('style');
  }

  onClickWatchlist() {
    this.isCollapsed = !this.isCollapsed;
    let searchButton = document.getElementById('search-button');
    let watchlistButton = document.getElementById('watchlist-button');
    let portfolioButton = document.getElementById('portfolio-button');
    let searchLink = document.getElementById('search-link');
    let watchlistLink = document.getElementById('watchlist-link');
    let portfolioLink = document.getElementById('portfolio-link');
    watchlistButton!.style.border = 'white solid';
    portfolioButton!.style.border = 'none';
    searchButton!.style.border = 'none';
    searchLink!.removeAttribute('style');
    watchlistLink!.style.color = 'white';
    portfolioLink!.removeAttribute('style');
  }

  onClickPortfolio(){
    this.isCollapsed = !this.isCollapsed;
    let searchButton = document.getElementById('search-button');
    let watchlistButton = document.getElementById('watchlist-button');
    let portfolioButton = document.getElementById('portfolio-button');
    let searchLink = document.getElementById('search-link');
    let watchlistLink = document.getElementById('watchlist-link');
    let portfolioLink = document.getElementById('portfolio-link');
    watchlistButton!.style.border = 'none';
    portfolioButton!.style.border = 'white solid';
    searchButton!.style.border = 'none';
    searchLink!.removeAttribute('style');
    watchlistLink!.removeAttribute('style');
    portfolioLink!.style.color = 'white';
  }
}
