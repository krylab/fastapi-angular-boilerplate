import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserDropdownComponent } from '../../dropdowns/user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [UserDropdownComponent],
})
export class AdminNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
