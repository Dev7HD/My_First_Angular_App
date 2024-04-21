import {AfterViewInit, Component, EventEmitter, OnInit, Output, output, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.eventEmitter()
  }
  navbarItems : Array<any> = [
    {title: "Home", page: "/home", icon: "house"},
    {title: "Products", page: "/products", icon: "diagram-2"},
    {title: "New Product", page: "/new", icon: "node-plus"}
  ]

  @ViewChild('standardTpl') public standardTemplateRef!: TemplateRef<any>;
  @ViewChild('successTpl') public successTemplateRef!: TemplateRef<any>;
  @ViewChild('dangerTpl') public errorTemplateRef!: TemplateRef<any>;
  @Output() stdTemplateRef: EventEmitter<any> = new EventEmitter();

  eventEmitter() {
    this.stdTemplateRef.emit(this.standardTemplateRef);
  }


  currentItem : any;


  setCurrentItem(item: any){
    this.currentItem = item;
  }
}
