import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IndexDropdownComponent } from '../../dropdowns/index-dropdown/index-dropdown.component';

@Component({
  selector: 'app-index-navbar',
  templateUrl: './index-navbar.component.html',
  imports: [RouterLink, NgClass, IndexDropdownComponent],
})
export class IndexNavbarComponent implements OnInit {
  navbarOpen = false;

  constructor() {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
}
