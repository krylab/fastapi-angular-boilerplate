import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterAdminComponent } from '../../common/components/footers/footer-admin/footer-admin.component';
import { AdminNavbarComponent } from '../../common/components/navbars/admin-navbar/admin-navbar.component';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SidebarComponent, AdminNavbarComponent, FooterAdminComponent, RouterOutlet],
})
export class AdminComponent {}
