import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';
import { AppType } from './models/enums';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [AuthGuard, RoleGuard(AppType.ADMIN)],
  },
  {
    path: 'minigame',
    loadComponent: () =>
      import('./pages/minigame/minigame.component').then((m) => m.MinigameComponent),
    canActivate: [AuthGuard, RoleGuard(AppType.ADMIN, AppType.MEMBER)],
  },
];
