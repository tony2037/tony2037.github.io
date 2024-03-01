import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component'
import { DetailsComponent } from './details/details.component';

import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', component: SearchComponent }, 
    { path: 'watchlist', component: WatchlistComponent }, 
    { path: 'portfolio', component: PortfolioComponent },
    { path: 'details/:ticker', component: DetailsComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}