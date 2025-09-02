import { NgClass } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-pages-dropdown',
  templateUrl: './pages-dropdown.component.html',
  imports: [NgClass, RouterLink],
})
export class PagesDropdownComponent implements OnInit {
  dropdownPopoverShow = false;
  @ViewChild('btnDropdownRef', { static: false }) btnDropdownRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('popoverDropdownRef', { static: false })
  popoverDropdownRef!: ElementRef<HTMLDivElement>;
  ngOnInit() {}
  toggleDropdown(event: Event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
      this.createPoppper();
    }
  }
  createPoppper() {
    createPopper(this.btnDropdownRef.nativeElement, this.popoverDropdownRef.nativeElement, {
      placement: 'bottom-start',
    });
  }
}
