import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {NewProductComponent} from "./new-product/new-product.component";
import {EditProductComponent} from "./edit/edit.component";
import {AdminComponent} from "./admin/admin.component";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: "login", pathMatch: "full"},
  {path: "admin", component: AdminComponent, children: [
      {path: "products", component: ProductComponent},
      {path: "new", component: NewProductComponent},
      {path: "edit/:id", component: EditProductComponent}
    ]},
  {path: "home", component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
