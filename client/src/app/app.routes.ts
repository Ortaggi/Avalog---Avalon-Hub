import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { guestGuard } from './core/guest.guard';
import { AuthLayoutComponent } from './features/auth/layout.component';
import { LoggedLayoutComponent } from './features/logged-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivateChild: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
    ],
    component: AuthLayoutComponent,
  },
  {
    path: '',
    canActivateChild: [authGuard],
    component: LoggedLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-home.component').then(
            (m) => m.DashboardHomeComponent,
          ),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./features/groups/pages/group-list/groups-list.component').then(
            (m) => m.GroupsListComponent,
          ),
      },
      {
        path: 'games',
        loadComponent: () =>
          import('./features/matches/pages/matches-list/matches-list.component').then(
            (m) => m.MatchesListComponent,
          ),
      },
      {
        path: 'games/create',
        loadComponent: () =>
          import('./features/matches/pages/match-create/match-create.component').then(
            (m) => m.MatchCreateComponent,
          ),
      },
      {
        path: 'games/:id',
        loadComponent: () =>
          import('./features/matches/pages/match-create/match-create.component').then(
            (m) => m.MatchCreateComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
