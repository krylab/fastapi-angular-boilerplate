import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../../../common/components/card/card.component';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardComponent],
})
export class MapsComponent {}
