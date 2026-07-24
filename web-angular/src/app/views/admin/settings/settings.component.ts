import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent } from '../../../common/components/card/card.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CardComponent],
})
export class SettingsComponent {}
