import { Directive, ElementRef, HostListener, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appTogglePassword]',
  standalone: true
})
export class TogglePasswordDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  private _shown = false;

  @HostListener('click')
  togglePasswordVisibility() {
    this._shown = !this._shown;
    this.renderer.setAttribute(
      this.el.nativeElement.parentNode.querySelector('input'),
      'type',
      this._shown ? 'text' : 'password'
    );

    // Change the icon class accordingly
    if (this._shown) {
      this.renderer.addClass(this.el.nativeElement, 'fa-eye-slash');
      this.renderer.removeClass(this.el.nativeElement, 'fa-eye');
    } else {
      this.renderer.addClass(this.el.nativeElement, 'fa-eye');
      this.renderer.removeClass(this.el.nativeElement, 'fa-eye-slash');
    }
  }
}
