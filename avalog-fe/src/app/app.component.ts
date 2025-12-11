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
    await this.authService.restoreSession();
    this.isReady.set(true);
  }
}
