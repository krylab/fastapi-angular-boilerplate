import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
  standalone: true
})
export class DropdownDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);


  private isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
    const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
    if (this.isOpen) {
      this.renderer.setStyle(dropdownMenu, 'display', 'block');
    } else {
      this.renderer.setStyle(dropdownMenu, 'display', 'none');
    }
  }

  @HostListener('document:click', ['$event.target']) close(targetElement: EventTarget) {
    const insideClick = this.el.nativeElement.contains(targetElement);
    if (!insideClick) {
      this.isOpen = false;
      const dropdownMenu = this.el.nativeElement.querySelector('.dropdown-menu');
      this.renderer.setStyle(dropdownMenu, 'display', 'none');
    }
  }

}
