import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, GroupService, MatchService, UserService } from '../../../../core/services';
import {
  AVALON_ROLES,
  Faction,
  Group,
  Match,
  PlayerMatch,
  User,
  VictoryType,
} from '../../../../core/models';

interface PlayerSelection {
  user: User;
  selected: boolean;
  roleId: string;
}

@Component({
  selector: 'app-match-create',
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [MatchDetailStore, UsersService, GroupService, GameService],
  standalone: true,
  templateUrl: './match-create.component.html',
  styleUrl: './match-create.component.scss',
})
export class MatchCreateComponent implements OnInit {
  private authService = inject(AuthService);
  private matchService = inject(MatchService);
  private groupService = inject(GroupService);
  private userService = inject(UserService);
  private router = inject(Router);

  currentStep = 1;

  groups: Group[] = [];
  players: PlayerSelection[] = [];
  roles = AVALON_ROLES;

  // Form Data
  selectedGroupId = '';
  matchDate = new Date().toISOString().split('T')[0];
  winningFaction: Faction = 'good';
  victoryType: VictoryType = 'missions';
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
      const user = this.authService.getCurrentUser();
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
      console.log('onGroupChange - memberIds:', group?.memberIds);

      if (group) {
        const users: PlayerSelection[] = [];
        for (const memberId of group.memberIds) {
          console.log('onGroupChange - carico membro:', memberId);
          const user = await this.userService.getById(memberId);
          console.log('onGroupChange - user trovato:', user);
          if (user) {
            users.push({ user, selected: false, roleId: '' });
          }
        }
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

  getRolesForFaction(faction: Faction) {
    return this.roles.filter((r) => r.faction === faction);
  }

  getRoleName(roleId: string): string {
    return this.roles.find((r) => r.id === roleId)?.name || roleId;
  }

  getRoleFaction(roleId: string): Faction | undefined {
    return this.roles.find((r) => r.id === roleId)?.faction;
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
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.errorMessage = 'Utente non autenticato';
        return;
      }

      const players: PlayerMatch[] = this.getSelectedPlayers().map((p) => ({
        idPlayer: p.user.id,
        idRole: p.roleId,
      }));

      const matchData: Omit<Match, 'id' | 'createdAt'> = {
        groupId: this.selectedGroupId,
        date: new Date(this.matchDate),
        players,
        winningFaction: this.winningFaction,
        victoryType: this.victoryType,
        notes: this.notes || undefined,
        createdBy: user.id,
      };

      await this.matchService.create(matchData);
      this.router.navigate(['/matches']);
    } catch (error) {
      console.error('Errore salvataggio partita:', error);
      this.errorMessage = 'Errore nel salvataggio della partita';
    } finally {
      this.isSaving = false;
    }
  }
}
export class MatchCreateComponent implements OnInit {
  store = inject(MatchDetailStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  routeParams$ = this.route.params.pipe(takeUntilDestroyed());
  roles = AVALON_ROLES;

  gamesResults: { label: string; value: GameResultType }[] = [
    { label: 'Vittoria Buoni', value: 'GOOD_WIN' },
    { label: 'Vittoria Cattivi', value: 'EVIL_WIN' },
  ];

  winTypes: { label: string; value: VictoryType }[] = [
    { label: '3 Missioni', value: 'THREE_MISSIONS' },
    { label: 'Assassinio', value: 'ASSASSINATION' },
  ];

  ngOnInit() {
    this.routeParams$.subscribe(({ id }) => {
      if (id) {
        this.store.getGameDetail(id);
      }
    });
  }

  isRoleTaken(roleId: string): boolean {
    const participants = this.store.game().participants || [];
    return participants.some((p) => p.role === roleId);
  }

  isUserTaken(userId: string): boolean {
    const participants = this.store.game().participants || [];
    return participants.some((p) => p.userId === userId);
  }

  async saveGame() {
    await this.store.saveGame();
    this.router.navigate(['/matches']);
  }
}
