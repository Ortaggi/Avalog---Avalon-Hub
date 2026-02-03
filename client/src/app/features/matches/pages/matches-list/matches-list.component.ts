import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../../../../shared/services/games.service';
import { AVALON_ROLES } from '../../../../shared/models/roles';
import { MatchListStore } from './match-list.store';
import { DatePickerComponent } from '../../../../shared/components/datePicker/date-picker.component';

@Component({
  selector: 'app-matches-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DatePickerComponent],
  providers: [GameService, MatchListStore],
  templateUrl: './matches-list.component.html',
  styleUrl: './matches-list.component.scss',
})
export class MatchesListComponent implements OnInit {
  store = inject(MatchListStore);
  private fb = inject(FormBuilder);

  roles = AVALON_ROLES;
  filterForm: FormGroup;

  constructor() {
    this.filterForm = this.fb.group({
      startDate: [null],
      endDate: [null],
      result: [''],
      winType: [''],
    });
  }

  async ngOnInit() {
    this.filterForm.valueChanges.subscribe((filters) => {
      this.store.loadData(filters);
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      startDate: null,
      endDate: null,
      result: '',
      winType: '',
    });
    this.store.loadData(null);
  }
}
