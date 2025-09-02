import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footers/footer/footer.component';
import { IndexNavbarComponent } from '../../components/navbars/index-navbar/index-navbar.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  imports: [RouterLink, IndexNavbarComponent, FooterComponent],
})
export class IndexComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
