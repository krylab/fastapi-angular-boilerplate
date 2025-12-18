import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/components/footers/footer/footer.component';
import { IndexNavbarComponent } from '../../common/components/navbars/index-navbar/index-navbar.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  imports: [RouterLink, IndexNavbarComponent, FooterComponent],
})
export class IndexComponent {}
