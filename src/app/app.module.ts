import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import {HttpClientModule} from "@angular/common/http";
import { NewProductComponent } from './new-product/new-product.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EditProductComponent } from './edit/edit.component';
import {NgbModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ToastsContainer} from "./toast-container.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductComponent,
    NewProductComponent,
    EditProductComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgbTooltipModule,
    ToastsContainer
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
