import { Component, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div
      class="sidebar-backdrop"
      tabindex="-1"
      (keypress)="closeSidebar()"
      (click)="closeSidebar()"
    ></div>
    <div
      class="sidebar-content bg-medium-grey"
      [class.closing]="isClosing()"
      (animationend)="onAnimationEnd($event)"
    >
      <div class="d-flex justify-content-end p-3">
        <button
          type="button"
          class="btn-close btn-close-white"
          aria-label="Close"
          (click)="closeSidebar()"
        ></button>
      </div>
      <ul class="navbar-nav p-4">
        <li class="nav-item mb-3">
          <a
            class="nav-link h4"
            routerLink="/dashboard"
            routerLinkActive="active"
            (click)="closeSidebar()"
            >Dashboard</a
          >
        </li>
        <li class="nav-item mb-3">
          <a
            class="nav-link h4"
            routerLink="/games"
            routerLinkActive="active"
            (click)="closeSidebar()"
            >Partite</a
          >
        </li>
        <li class="nav-item mb-3">
          <a
            class="nav-link h4"
            routerLink="/leaderboard"
            routerLinkActive="active"
            (click)="closeSidebar()"
            >Classifiche</a
          >
        </li>
        <li class="nav-item mb-3">
          <a
            class="nav-link h4"
            routerLink="/groups"
            routerLinkActive="active"
            (click)="closeSidebar()"
            >Gruppi</a
          >
        </li>
        <hr class="text-white" />
        <li class="nav-item mb-3">
          <a
            class="nav-link h4"
            routerLink="/profile"
            routerLinkActive="active"
            (click)="closeSidebar()"
            >Profilo</a
          >
        </li>
        <li class="nav-item mb-3">
          <a class="nav-link h4" routerLink="/auth/login" (click)="closeSidebar()">Accedi</a>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .sidebar-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1040;
      }

      .sidebar-content {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        z-index: 1050;
        width: 100%;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;

        /* In effect: Animate IN immediately on creation */
        animation: slideIn 0.3s ease-out forwards;
      }

      /* Animate OUT when .closing class is added */
      .sidebar-content.closing {
        animation: slideOut 0.3s ease-in forwards;
      }

      /* Keyframes */
      @keyframes slideIn {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(100%);
        }
      }

      /* Tablet breakpoint (approx 768px) */
      @media (min-width: 768px) {
        .sidebar-content {
          width: 50%;
        }
      }
    `,
  ],
})
export class SidebarComponent {
  closeSidebarEvent = output<void>();
  isClosing = signal(false);

  closeSidebar() {
    this.isClosing.set(true);
  }

  onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.includes('slideOut')) {
      this.closeSidebarEvent.emit();
    }
  }
}
