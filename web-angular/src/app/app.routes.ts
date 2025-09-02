import { Routes } from '@angular/router';

export const routes: Routes = [
  // admin layout
  {
    path: 'admin',
    loadComponent: () => import('./views/admin/admin.component').then(m => m.AdminComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./views/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'settings', loadComponent: () => import('./views/admin/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'tables', loadComponent: () => import('./views/admin/tables/tables.component').then(m => m.TablesComponent) },
      { path: 'maps', loadComponent: () => import('./views/admin/maps/maps.component').then(m => m.MapsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // auth layout
  {
    path: 'auth',
    loadComponent: () => import('./views/auth/auth.component').then(m => m.AuthComponent),
    children: [
      { path: 'login', loadComponent: () => import('./views/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./views/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  // no layout
  { path: 'profile', loadComponent: () => import('./views/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'landing', loadComponent: () => import('./views/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'error-demo', loadComponent: () => import('./components/error-demo/error-demo.component').then(m => m.ErrorDemoComponent) },
  { path: '', loadComponent: () => import('./views/index/index.component').then(m => m.IndexComponent) },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
