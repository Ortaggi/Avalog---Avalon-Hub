import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatchListStore } from './match-list.store';
import { GameService } from '../../../../shared/services/games.service';
import { debounceTime } from 'rxjs/operators';
import { DatePickerComponent } from '../../../../shared/components/datePicker/date-picker.component';

@Component({
  selector: 'app-matches-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, DatePickerComponent],
  providers: [GameService, MatchListStore],
  templateUrl: './matches-list.component.html',
  styleUrl: './matches-list.component.scss',
})
export class MatchesListComponent {
  store = inject(MatchListStore);

  // Game filters
  filterForm: FormGroup;

  constructor() {
    this.filterForm = new FormGroup({
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      result: new FormControl(''),
      winType: new FormControl(''),
    });

    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe((values) => {
      this.store.loadData(values);
    });
  }

  resetFilters() {
    this.filterForm.reset();
  }
}
