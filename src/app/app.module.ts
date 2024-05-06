import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { NewProductComponent } from './new-product/new-product.component';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EditProductComponent } from './edit/edit.component';
import {NgbModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ToastsContainer} from "./toast-container.component";
import {AppInterceptor} from "./interceptor/app.interceptor";

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
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
