import { Component } from '@angular/core';
import {LoadingService} from "../services/loading.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(public loadingService:LoadingService) {}

  navbarItems : Array<any> = [
    {title: "Home", page: "/admin/home", icon: "house"},
    {title: "Products", page: "/admin/products", icon: "diagram-2"},
    {title: "New Product", page: "/admin/new", icon: "node-plus"}
  ]

  currentItem : any;

  setCurrentItem(item: any){
    this.currentItem = item;
  }
}
