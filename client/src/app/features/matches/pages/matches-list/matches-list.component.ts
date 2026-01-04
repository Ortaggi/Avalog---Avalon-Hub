import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService, GroupService, MatchService } from '../../../../core/services';
import { AVALON_ROLES, Group, Match } from '../../../../core/models';

@Component({
  selector: 'app-matches-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './matches-list.component.html',
  standalone: true,
  styleUrl: './matches-list.component.scss'
})
export class MatchesListComponent implements OnInit {
  private authService = inject(AuthService);
  private matchService = inject(MatchService);
  private groupService = inject(GroupService);

  isLoading = true;
  roles = AVALON_ROLES;

  groups: Group[] = [];
  matches: Match[] = [];
  filteredMatches: Match[] = [];

  selectedGroupId = '';
  selectedEsito = '';
  sortOrder: 'desc' | 'asc' = 'desc';

  async ngOnInit() {
    await this.loadData();
  }

  private async loadData() {
    this.isLoading = true;

    // TODO: Timeout da togliere, messo solo per il testing
    setTimeout(async () => {
      try {
        const user = this.authService.getCurrentUser();
        if (user) {
          this.matches = await this.matchService.getByUserId(user.id);
          this.groups = await this.groupService.getByUserId(user.id);
          this.applyFilter();
        }
      } catch (error) {
        console.error('Errore nel caricamento delle partite: ', error);
      } finally {
        this.isLoading = false;
      }
    }, 3000);
  }

  applyFilter(): void {
    let result = [...this.matches];

    if (this.selectedGroupId) {
      result = result.filter((m) => m.groupId === this.selectedGroupId);
    }

    if (this.selectedEsito) {
      const user = this.authService.getCurrentUser();
      if (user) {
        result = result.filter((m) => {
          const won = this.didUserWin(m);
          // Ritorno il valore di won se voglio vedere le partite vinte, altrimenti torno won negato
          // Esempio nel caso voglio vedere le partite vinte:
          // Se ho vinto: won=true -> ritorno won=true
          // Se ho perso: won=false -> ritorno won = false
          // Esempio nel caso voglio vedere le partite perse:
          // Se ho vinto: won=true -> ritorno won=false
          // Se ho perso: won=false -> ritorno won = true
          return this.selectedEsito === 'win' ? won : !won;
        });
      }
    }

    //Ordinamento
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    this.filteredMatches = result;
  }

  didUserWin(match: Match): boolean {
    const roleId = this.getUserRoleInMatch(match);
    const faction = this.getRoleFaction(roleId);
    return faction === match.winningFaction;
  }

  getUserRoleInMatch(match: Match): string {
    const user = this.authService.getCurrentUser();
    if (!user) return '';

    const player = match.players.find((p) => p.idPlayer === user.id);
    return player?.idRole || '';
  }

  getRoleFaction(roleId: string): 'good' | 'evil' | 'unknown' {
    return this.roles.find((r) => r.id === roleId)?.faction || 'unknown';
  }

  resetFilters(): void {
    this.selectedGroupId = '';
    this.selectedEsito = '';
    this.sortOrder = 'desc';
    this.applyFilter();
  }

  getVictoryTypeLabel(type: string): string {
    return type === 'missions' ? '3 Missioni' : 'Assassinio Merlino';
  }

  getVictoryTypeIcon(type: string): string {
    return type === 'missions' ? '⚔️' : '🗡️';
  }

  getRoleName(roleId: string): string {
    return this.roles.find((r) => r.id === roleId)?.name || roleId;
  }

  getGroupName(groupId: string): string {
    return this.groups.find((g) => g.id === groupId)?.name || 'Gruppo sconosciuto';
  }
}
