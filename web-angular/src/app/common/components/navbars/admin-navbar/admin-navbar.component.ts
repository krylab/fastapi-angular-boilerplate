import { Component, OnInit } from '@angular/core';
import { UserDropdownComponent } from '../../dropdowns/user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  imports: [UserDropdownComponent],
})
export class AdminNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
