import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const defaultDateFormat = 'dd/MM/yyyy';

type DatePickerType = 'single' | 'range';

@Component({
  selector: 'app-date-picker-calendar',
  template: `
    <div class="calendar">
      <div class="calendar-header">
        <button class="btn prev-month" (click)="prevMonth()">&lt;</button>
        <span class="month-year">{{ months()[currentMonth()] }} {{ currentYear() }}</span>
        <button class="btn next-month" (click)="nextMonth()">&gt;</button>
      </div>
      <div class="calendar-body">
        <div class="days-in-month">
          @for (day of monthDaySet(); track $index) {
            <div class="day">
              <button
                class="day-button"
                [disabled]="day === ''"
                [class.selected]="selectedDate()?.valueOf() === day.valueOf()"
                (click)="selectDay(day)"
              >
                {{ day | date: 'dd' }}
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .calendar {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: absolute;
      z-index: 1000;
    }
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid #ccc;
    }
    .calendar-body {
      padding: 0.5rem;
    }
    .calendar-footer {
      padding: 0.5rem;
      border-top: 1px solid #ccc;
    }
    .days-in-month {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }
    .day {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .day-button {
      border: 1px solid #ccc;
      border-radius: 8px;
      background: transparent;
      width: 100%;
      height: 100%;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      cursor: pointer;

      &.selected {
        background-color: #007bff;
        color: #fff;
      }
      &:hover {
        background-color: #f0f0f0;
      }
      &:active {
        background-color: #ccc;
      }
      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  `,
  imports: [DatePipe],
})
export class DatePickerCalendarComponent {
  type = input.required<DatePickerType>();
  dateInput = input.required<Date | null>();
  dateSelected = output<Date>();
  currentMonth = signal<number>(new Date().getMonth());
  currentYear = signal<number>(new Date().getFullYear());
  selectedDate = signal<Date | null>(null);

  months = signal([
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ]);
  daysInWeek = signal(['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']);
  daysInMonth = signal<number[]>([]);

  constructor() {
    effect(() => {
      const date = this.dateInput();
      if (date) {
        this.selectedDate.set(date);
        this.currentMonth.set(date.getMonth());
        this.currentYear.set(date.getFullYear());
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        this.selectedDate.set(today);
        this.currentMonth.set(today.getMonth());
        this.currentYear.set(today.getFullYear());
      }
    });
  }
  monthDaySet = computed(() => {
    return this._generateCalendar(this.currentYear(), this.currentMonth());
  });
  private _generateCalendar(year: number, month: number): (Date | string)[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayWeek = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 1; i < firstDayWeek; i++) {
      days.push('');
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }

  selectDay(day: Date | string) {
    if (day instanceof Date) {
      this.dateSelected.emit(day);
    }
  }

  prevMonth() {
    this.currentMonth.update((month) => {
      if (month === 0) {
        this.currentYear.update((year) => year - 1);
        return 11;
      }
      return month - 1;
    });
  }

  nextMonth() {
    this.currentMonth.update((month) => {
      if (month === 11) {
        this.currentYear.update((year) => year + 1);
        return 0;
      }
      return month + 1;
    });
  }
}

@Component({
  selector: 'app-date-picker',
  imports: [DatePickerCalendarComponent, DatePipe],
  template: `
    <label class="form-label" for="datePicker">{{ label() }}</label>
    <input
      id="datePicker"
      placeholder="gg/mm/aaaa"
      class="form-control"
      type="text"
      [value]="valueString() | date: dateFormat()"
      (click)="showCalendar.set(true)"
      [disabled]="disabled()"
      (blur)="onTouched()"
    />
    @if (showCalendar()) {
      <app-date-picker-calendar
        [type]="type()"
        [dateInput]="valueDate()"
        (dateSelected)="onDateSelected($event)"
      ></app-date-picker-calendar>
    }
  `,
  host: {
    style: 'position: relative',
  },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DatePickerComponent), multi: true },
  ],
})
export class DatePickerComponent implements ControlValueAccessor {
  private elementRef = inject(ElementRef);
  dateFormat = input<string>(defaultDateFormat);
  type = input<DatePickerType>('single');
  label = input<string>('Date');
  value = signal<string | null>(null);
  valueString = computed(() => this.value() || '');
  valueDate = computed(() => {
    if (!this.value()) return null;
    const date = new Date(this.value() as string);
    date.setHours(0, 0, 0, 0);
    return date;
  });
  disabled = signal<boolean>(false);
  showCalendar = signal<boolean>(false);
  onChange: (value: string) => void = () => {
    return;
  };
  onTouched: () => void = () => {
    return;
  };

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.showCalendar()) {
      this.showCalendar.set(false);
    }
  }

  writeValue(obj: string): void {
    this.value.set(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onDateSelected(date: Date) {
    this.value.set(date.toISOString());
    this.onChange(date.toISOString());
    this.showCalendar.set(false);
  }
}
