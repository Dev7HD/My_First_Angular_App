import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  navbarItems : Array<any> = [
    {title: "Home", page: "/home", icon: "house"},
    {title: "Products", page: "/products", icon: "diagram-2"},
    {title: "New Product", page: "/new", icon: "node-plus"}
  ]

  currentItem : any;

  setCurrentItem(item: any){
    this.currentItem = item;
  }
}
