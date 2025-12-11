import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, MatchService, StatsService } from '../../../../core/services';
import { AVALON_ROLES, Match, PlayerStats } from '../../../../core/models';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
  standalone: true
})
export class DashboardHomeComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private statsService: StatsService = inject(StatsService);
  private matchService: MatchService = inject(MatchService);

  stats: PlayerStats | null = null;
  recentMatches: Match[] = [];
  roles = AVALON_ROLES;

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.stats = this.statsService.getPlayerStats(user.id);
      this.recentMatches = this.matchService
        .getByUserId(user.id)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);
    }
  }

  getRoleName(roleId: string): string {
    return this.roles.find((r) => r.id === roleId)?.name || roleId;
  }

  getRoleFaction(roleId: string): string {
    return this.roles.find((r) => r.id === roleId)?.faction || 'unknown';
  }
}
