import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, StatsService, MatchService } from '../../../../core/services';
import { PlayerStats, Match, AVALON_ROLES } from '../../../../core/models';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  private authService = inject(AuthService);
  private statsService = inject(StatsService);
  private matchService = inject(MatchService);

  stats: PlayerStats | null = null;
  recentMatches: Match[] = [];
  roles = AVALON_ROLES;
  isLoading = true;

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    this.isLoading = true;

    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.stats = await this.statsService.getPlayerStats(user.id);

        const matches = await this.matchService.getByUserId(user.id);
        this.recentMatches = matches
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
      }
    } catch (error) {
      console.error('Errore nel caricamento dati:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getRoleName(roleId: string): string {
    return this.roles.find((r) => r.id === roleId)?.name || roleId;
  }

  getRoleFaction(roleId: string): string {
    return this.roles.find((r) => r.id === roleId)?.faction || 'unknown';
  }

  getPlayerRoleInMatch(match: Match): string {
    const user = this.authService.getCurrentUser();
    if (!user) return '';

    const player = match.players.find((p) => p.idPlayer === user.id);
    return player?.idRole || '';
  }
}
