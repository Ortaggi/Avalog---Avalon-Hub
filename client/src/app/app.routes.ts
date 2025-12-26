import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: 'matches',
    canActivate: [authGuard],
    loadChildren: () => import('./features/matches/matches.module').then((m) => m.MatchesModule)
  },
  {
    path: 'leaderboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/leaderboard/leaderboard.module').then((m) => m.LeaderboardModule)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule)
  },
  {
    path: 'groups',
    canActivate: [authGuard],
    loadChildren: () => import('./features/groups/groups.module').then((m) => m.GroupsModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
