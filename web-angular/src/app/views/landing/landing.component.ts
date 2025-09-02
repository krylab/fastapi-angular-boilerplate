import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footers/footer/footer.component';
import { AuthNavbarComponent } from '../../components/navbars/auth-navbar/auth-navbar.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  imports: [RouterLink, AuthNavbarComponent, FooterComponent],
})
export class LandingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
