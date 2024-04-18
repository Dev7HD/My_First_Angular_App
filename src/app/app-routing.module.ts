import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {NewProductComponent} from "./new-product/new-product.component";
import {EditProductComponent} from "./edit/edit.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "products", component: ProductComponent},
  {path: "new", component: NewProductComponent},
  {path: "edit/:id", component: EditProductComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
