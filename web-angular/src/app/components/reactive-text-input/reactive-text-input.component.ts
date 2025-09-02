import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reactive-text-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-text-input.component.html',
})
export class ReactiveTextInputComponent {
  @Input() control?: FormControl;
  @Input() id!: string;
  @Input() type: string = 'text';
  @Input() placeholder!: string;
  @Input() labelText!: string;
}
