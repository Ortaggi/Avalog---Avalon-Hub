import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-dark navbar-expand-lg border-bottom border-gold bg-medium-grey">
      <div class="container">
        <a class="navbar-brand h3 text-gold" routerLink="/dashboard">Avalog</a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link " routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link " routerLink="/matches" routerLinkActive="active">Partite</a>
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
              <a class="nav-link " routerLink="/profile" routerLinkActive="active">Profilo</a>
            </li>
            <li class="nav-item">
              <a class="nav-link " routerLink="/auth/login">Accedi</a>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-danger btn-sm ms-2" (click)="logout()">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  logout() {
    // Implement logout logic here
    console.log('User logged out');
  }
}
