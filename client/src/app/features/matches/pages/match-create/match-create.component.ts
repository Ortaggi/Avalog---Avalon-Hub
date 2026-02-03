import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { GroupService } from '../../../../shared/services/groups.service';
import { UsersService } from '../../../../shared/services/users.service';
import { GameService } from '../../../../shared/services/games.service';
import { AVALON_ROLES, Faction } from '../../../../shared/models/roles';
import {
  GameDetail,
  GameFactionType,
  GameRolesType,
  VictoryType,
  GameResultType,
} from '../../../../shared/models/games';
import { Group } from '../../../../shared/models/groups';

interface User {
  id: string;
  displayName: string;
}

interface PlayerSelection {
  user: User;
  selected: boolean;
  roleId: string;
}

@Component({
  selector: 'app-match-create',
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [UsersService, GroupService, GameService],
  standalone: true,
  templateUrl: './match-create.component.html',
  styleUrl: './match-create.component.scss',
})
export class MatchCreateComponent implements OnInit {
  private authService = inject(AuthService);
  private gameService = inject(GameService);
  private groupService = inject(GroupService);
  private userService = inject(UsersService);
  private router = inject(Router);

  currentStep = 1;

  groups: Group[] = [];
  players: PlayerSelection[] = [];
  roles = AVALON_ROLES;

  // Form Data
  selectedGroupId = '';
  matchDate = new Date().toISOString().split('T')[0];
  winningFaction: 'good' | 'evil' = 'good';
  victoryType: 'missions' | 'assassination' = 'missions';
  notes = '';

  //Stati
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  async ngOnInit(): Promise<void> {
    await this.loadGroups();
  }

  private async loadGroups(): Promise<void> {
    this.isLoading = true;
    try {
      const user = await this.authService.me();
      if (user) {
        this.groups = await this.groupService.getByUserId(user.id);
      }
    } catch (error) {
      console.error('Errore nel caricamento dei gruppi:', error);
      this.errorMessage = 'Errore nel caricamento dei gruppi.';
    } finally {
      this.isLoading = false;
    }
  }

  async onGroupChange(): Promise<void> {
    console.log('onGroupChange - selectedGroupId:', this.selectedGroupId);

    if (!this.selectedGroupId) {
      this.players = [];
      return;
    }

    try {
      const group = await this.groupService.getById(this.selectedGroupId);

      console.log('onGroupChange - group trovato:', group);
      console.log('onGroupChange - memberIds:', group?.members);

      if (group && group.members) {
        const users: PlayerSelection[] = group.members.map((member: any) => ({
          user: { id: member.id, displayName: member.displayName },
          selected: false,
          roleId: '',
        }));
        this.players = users;
        console.log('onGroupChange - players finali:', this.players);
      }
    } catch (error) {
      console.error('Errore nel caricamento dei membri:', error);
    }
  }

  getSelectedPlayers(): PlayerSelection[] {
    return this.players.filter((p) => p.selected);
  }

  getSelectedPlayersCount(): number {
    return this.getSelectedPlayers().length;
  }

  isStep1Valid(): boolean {
    const count = this.getSelectedPlayersCount();
    console.log('isStep1Valid - groupId:', this.selectedGroupId, 'count:', count);
    return !!this.selectedGroupId && count >= 4 && count <= 10;
  }

  isStep2Valid(): boolean {
    const selectedPlayers = this.getSelectedPlayers();
    return selectedPlayers.every((p) => p.roleId !== '') && this.validateRoles();
  }

  isStep3Valid(): boolean {
    return !!this.winningFaction && !!this.victoryType && !!this.matchDate;
  }

  validateRoles(): boolean {
    const selectedPlayers = this.getSelectedPlayers();
    const selectedRoles = selectedPlayers.map((p) => p.roleId);

    // Verifica che non ci siano ruoli duplicati (eccetto loyal e minion)
    const uniqueRoles = selectedRoles.filter((r) => r !== 'loyal' && r !== 'minion');
    const uniqueSet = new Set(uniqueRoles);

    return uniqueRoles.length === uniqueSet.size;
  }

  getRolesForFaction(faction: 'good' | 'evil') {
    const factionUpper: Faction = faction.toUpperCase() as Faction;
    return this.roles.filter((r) => r.faction === factionUpper);
  }

  getRoleName(roleId: string): string {
    return this.roles.find((r) => r.id === roleId)?.name || roleId;
  }

  getRoleFaction(roleId: string): 'good' | 'evil' | undefined {
    const faction = this.roles.find((r) => r.id === roleId)?.faction;
    return faction ? (faction.toLowerCase() as 'good' | 'evil') : undefined;
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.isStep1Valid()) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.isStep2Valid()) {
      this.currentStep = 3;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  allPlayersHaveRoles(): boolean {
    return this.getSelectedPlayers().every((p) => p.roleId !== '');
  }

  goToStep(step: number): void {
    if (step === 1) {
      this.currentStep = 1;
    } else if (step === 2 && this.isStep1Valid()) {
      this.currentStep = 2;
    } else if (step === 3 && this.isStep1Valid() && this.isStep2Valid()) {
      this.currentStep = 3;
    }
  }

  async saveMatch(): Promise<void> {
    if (!this.isStep3Valid()) return;

    this.isSaving = true;
    this.errorMessage = '';

    try {
      const user = await this.authService.me();
      if (!user) {
        this.errorMessage = 'Utente non autenticato';
        return;
      }

      const result: GameResultType = this.winningFaction === 'good' ? 'GOOD_WIN' : 'EVIL_WIN';
      const winType: VictoryType =
        this.victoryType === 'missions' ? 'THREE_MISSIONS' : 'ASSASSINATION';

      const participants = this.getSelectedPlayers().map((p) => {
        const role = this.roles.find((r) => r.id === p.roleId);
        return {
          userId: p.user.id,
          role: p.roleId as GameRolesType,
          faction: (role?.faction as GameFactionType) || 'GOOD',
          nickname: p.user.displayName,
        };
      });

      const gameData: Partial<GameDetail> = {
        groupId: this.selectedGroupId,
        playedAt: new Date(this.matchDate),
        result,
        winType,
        notes: this.notes || undefined,
        participants,
      };

      await this.gameService.createGame(gameData as GameDetail);
      this.router.navigate(['/matches']);
    } catch (error) {
      console.error('Errore salvataggio partita:', error);
      this.errorMessage = 'Errore nel salvataggio della partita';
    } finally {
      this.isSaving = false;
    }
  }
}
