import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  template: ` <div class="container full-height">
    <router-outlet></router-outlet>
  </div>`,
  imports: [RouterOutlet],
})
export class AuthLayoutComponent {}
