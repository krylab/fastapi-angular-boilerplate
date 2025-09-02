import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PagesDropdownComponent } from '../../dropdowns/pages-dropdown/pages-dropdown.component';

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  imports: [RouterLink, NgClass, PagesDropdownComponent],
})
export class AuthNavbarComponent implements OnInit {
  navbarOpen = false;

  constructor() {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
}
