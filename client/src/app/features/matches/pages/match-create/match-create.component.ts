import { Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatchDetailStore } from './match-detail.store';
import { UsersService } from '../../../../shared/services/users.service';
import { GroupService } from '../../../../shared/services/groups.service';
import { GameService } from '../../../../shared/services/games.service';
import { AVALON_ROLES, VictoryType, GameResultType } from '../../../../shared/models';

@Component({
  selector: 'app-match-create',
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [MatchDetailStore, UsersService, GroupService, GameService],
  templateUrl: './match-create.component.html',
  styleUrl: './match-create.component.scss',
})
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
