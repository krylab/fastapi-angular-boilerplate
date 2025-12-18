import { Component } from '@angular/core';
import { CardComponent } from '../../../common/components/card/card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CardComponent],
})
export class DashboardComponent {}
