import {
  AfterViewInit,
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
  output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {LoadingService} from "./services/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(public loadingService:LoadingService) {}

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
