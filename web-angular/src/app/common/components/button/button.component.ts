import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button
      [type]="type()"
      [class]="buttonClass()"
      [disabled]="disabled()"
      (click)="onClick.emit($event)"
    >
      <ng-content />
    </button>
  `,
  imports: [],
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<'primary' | 'secondary' | 'danger' | 'success'>('primary');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);

  readonly onClick = output<MouseEvent>();

  readonly buttonClass = computed(() => {
    const base = 'font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150';
    const variants = {
      primary: 'bg-blueGray-800 text-white active:bg-blueGray-600',
      secondary: 'bg-blueGray-200 text-blueGray-800 active:bg-blueGray-300',
      danger: 'bg-red-500 text-white active:bg-red-600',
      success: 'bg-green-500 text-white active:bg-green-600',
    };
    const sizes = {
      sm: 'text-xs px-2 py-1',
      md: 'text-xs px-4 py-2',
      lg: 'text-sm px-6 py-3',
    };
    const width = this.fullWidth() ? 'w-full' : '';
    const disabled = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';
    
    return `${base} ${variants[this.variant()]} ${sizes[this.size()]} ${width} ${disabled}`.trim();
  });
}

