
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IndexDropdownComponent } from '../../dropdowns/index-dropdown/index-dropdown.component';

@Component({
  selector: 'app-index-navbar',
  templateUrl: './index-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, IndexDropdownComponent],
})
export class IndexNavbarComponent implements OnInit {
  navbarOpen = false;

  constructor() {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
}
