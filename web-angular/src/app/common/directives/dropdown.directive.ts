import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  host: {
    '(click)': 'toggleOpen()',
    '(document:click)': 'close($event.target)',
  },
})
export class DropdownDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  private isOpen = false;

  toggleOpen() {
    this.isOpen = !this.isOpen;
    const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
    if (this.isOpen) {
      this.renderer.setStyle(dropdownMenu, 'display', 'block');
    } else {
      this.renderer.setStyle(dropdownMenu, 'display', 'none');
    }
  }

  close(targetElement: EventTarget | null) {
    const insideClick = this.el.nativeElement.contains(targetElement);
    if (!insideClick) {
      this.isOpen = false;
      const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
      this.renderer.setStyle(dropdownMenu, 'display', 'none');
    }
  }
}
