import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component'
import { DetailsComponent } from './details/details.component';

import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'search/home', pathMatch: 'full' },
    { path: 'search/home', component: SearchComponent },
    { path: 'watchlist', component: WatchlistComponent }, 
    { path: 'portfolio', component: PortfolioComponent },
    { path: 'search/:ticker', component: DetailsComponent },
    { path: '**', redirectTo: 'search/home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}