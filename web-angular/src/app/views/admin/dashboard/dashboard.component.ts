import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../../../common/components/card/card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardComponent],
})
export class DashboardComponent {}
