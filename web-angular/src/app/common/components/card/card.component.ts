import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div
      class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
      [class]="cardClass()"
    >
      @if (title()) {
        <div class="rounded-t mb-0 px-4 py-3">
          <div class="flex flex-wrap items-center">
            <div class="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 class="font-semibold text-lg text-blueGray-700">{{ title() }}</h3>
            </div>
          </div>
        </div>
      }
      <div class="flex-auto px-4 py-5">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class CardComponent {
  readonly title = input<string>();
  readonly cardClass = input<string>('');
}

