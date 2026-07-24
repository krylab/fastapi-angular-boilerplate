import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/components/footers/footer/footer.component';
import { AuthNavbarComponent } from '../../common/components/navbars/auth-navbar/auth-navbar.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, AuthNavbarComponent, FooterComponent],
})
export class LandingComponent {}
