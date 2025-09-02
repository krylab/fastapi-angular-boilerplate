import { Component, OnInit } from '@angular/core';
import { CardBarChartComponent } from '../../../components/cards/card-bar-chart/card-bar-chart.component';
import { CardLineChartComponent } from '../../../components/cards/card-line-chart/card-line-chart.component';
import { CardPageVisitsComponent } from '../../../components/cards/card-page-visits/card-page-visits.component';
import { CardSocialTrafficComponent } from '../../../components/cards/card-social-traffic/card-social-traffic.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CardLineChartComponent, CardBarChartComponent, CardPageVisitsComponent, CardSocialTrafficComponent],
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
