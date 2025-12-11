import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  {
    path: 'matches',
    loadChildren: () => import('./features/matches/matches.module').then((m) => m.MatchesModule)
  },
  {
    path: 'leaderboard',
    loadChildren: () =>
      import('./features/leaderboard/leaderboard.module').then((m) => m.LeaderboardModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./features/groups/groups.module').then((m) => m.GroupsModule)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
