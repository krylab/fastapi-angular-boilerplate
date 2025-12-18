import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reactive-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-text-input.component.html',
})
export class ReactiveTextInputComponent {
  readonly control = input<FormControl>();
  readonly id = input.required<string>();
  readonly type = input<string>('text');
  readonly placeholder = input.required<string>();
  readonly labelText = input.required<string>();
}
