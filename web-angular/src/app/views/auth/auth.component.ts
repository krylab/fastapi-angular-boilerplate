import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterSmallComponent } from '../../common/components/footers/footer-small/footer-small.component';
import { AuthNavbarComponent } from '../../common/components/navbars/auth-navbar/auth-navbar.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AuthNavbarComponent, FooterSmallComponent, RouterOutlet],
})
export class AuthComponent {}
