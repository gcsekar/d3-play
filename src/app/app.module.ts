import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';

import { AppComponent } from './app.component';
import { GroceriesData } from './classes/groceries-data';
import { SalesDataService } from './shared/sales-data.service';
import { GroceriesListComponent } from './components/groceries-list/groceries-list.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';

@NgModule( {
    declarations: [
        AppComponent,
        GroceriesListComponent,
        BarChartComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,ReactiveFormsModule,
        HttpModule,
        InMemoryWebApiModule.forRoot(GroceriesData),
        InMemoryWebApiModule.forRoot(SalesDataService)
    ],
    providers: [SalesDataService],
    bootstrap: [AppComponent]
})
export class AppModule { }
