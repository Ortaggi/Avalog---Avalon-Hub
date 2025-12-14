import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  isReady = signal(false);

  async ngOnInit(): Promise<void> {
    // Piccolo delay per assicurarsi che tutto sia stato caricato
    // TODO: Trovare un altro modo per aspettare. Il token non viene letto correttamente
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
    //console.log('Cookie attuale:', document.cookie);
    //console.log('AppComponent ngOnInit - inizio restore');
    await this.authService.restoreSession();
    //console.log('AppComponent ngOnInit - restore completato, isAuthenticated:', this.authService.isAuthenticated());
    this.isReady.set(true);
  }
}
