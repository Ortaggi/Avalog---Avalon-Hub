import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { dashboardHomeStore } from './dashboard-home.store';
import { StatisticsService } from '../../shared/services/statistics.service';
import { GameService } from '../../shared/services/games.service';

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, RouterModule],
  providers: [dashboardHomeStore, StatisticsService, GameService],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent {
  store = inject(dashboardHomeStore);
}
