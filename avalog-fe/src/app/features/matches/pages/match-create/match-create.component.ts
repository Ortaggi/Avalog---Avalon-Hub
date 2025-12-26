import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-match-create',
  imports: [CommonModule, FormsModule, RouterModule],

  standalone: true,
  templateUrl: './match-create.component.html',
  styleUrl: './match-create.component.scss'
})
export class MatchCreateComponent {}
