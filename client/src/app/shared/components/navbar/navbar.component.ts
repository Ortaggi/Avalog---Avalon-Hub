import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { currentUserStore } from '../../current-user.store';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule, SidebarComponent, NgOptimizedImage],
  providers: [currentUserStore],
  template: `
    <nav class="navbar navbar-dark navbar-expand-lg border-bottom border-gold bg-medium-grey">
      <div class="container">
        <a class="navbar-brand h3 text-gold" routerLink="/dashboard">
          <img alt="Avalon Logo" width="48" height="48" ngSrc="avalog-logo.png" />
        </a>

        <button class="navbar-toggler" type="button" (click)="toggleSidebar()">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link " routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link " routerLink="/games" routerLinkActive="active">Partite</a>
            </li>
            <li class="nav-item">
              <a class="nav-link " routerLink="/leaderboard" routerLinkActive="active"
                >Classifiche</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link " routerLink="/groups" routerLinkActive="active">Gruppi</a>
            </li>
          </ul>

          <ul class="navbar-nav">
            <li class="nav-item">
              <div class="btn-group">
                <button
                  class="btn btn-secondary btn-sm dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="bi bi-person"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" routerLink="/profile">Profilo</a></li>
                  <li><button class="dropdown-item" (click)="logout()">Logout</button></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    @if (sidebarOpen()) {
      <app-sidebar (closeSidebarEvent)="toggleSidebar()"></app-sidebar>
    }
  `,
})
export class NavbarComponent {
  userStore = inject(currentUserStore);
  router = inject(Router);
  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update((open) => !open);
  }

  async logout() {
    await this.userStore.logout();
  }
}
