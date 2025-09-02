import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../components/footers/footer/footer.component';
import { AuthNavbarComponent } from '../../components/navbars/auth-navbar/auth-navbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [AuthNavbarComponent, FooterComponent],
})
export class ProfileComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
