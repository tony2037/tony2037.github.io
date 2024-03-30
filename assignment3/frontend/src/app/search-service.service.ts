import { Injectable } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private recentSearchRoute: string = 'home';

  constructor() {
  }

  getRecentSearchRoute(): string {
    return this.recentSearchRoute;
  }

  setRecentSearchRoute(route: string) {
    this.recentSearchRoute = route;
  }

}
