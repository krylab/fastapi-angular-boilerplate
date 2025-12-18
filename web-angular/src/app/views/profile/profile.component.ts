import { Component } from '@angular/core';
import { FooterComponent } from '../../common/components/footers/footer/footer.component';
import { AuthNavbarComponent } from '../../common/components/navbars/auth-navbar/auth-navbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [AuthNavbarComponent, FooterComponent],
})
export class ProfileComponent {}
