import {Component, OnInit} from '@angular/core';
import {AppStateService} from "../services/app-state.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  constructor(public appStateService:AppStateService) {
  }

  ngOnInit() {
    this.appStateService.getAllProducts()
  }



}
