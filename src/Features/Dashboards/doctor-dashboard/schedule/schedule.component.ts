import { ChangeDetectionStrategy, Component, computed, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { INITIAL_SCHEDULE, ScheduleSettings, SelectOption, WorkingDay, Hours } from './schedule.interface';
import { Dialog } from "primeng/dialog";

@Component({
  selector: 'app-doctor-schedule',
  imports: [ButtonModule, FormsModule, InputNumberModule, SelectModule, ReactiveFormsModule, Dialog],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorSchedule {
  StartHourOptions = signal<SelectOption<string>[]>(Hours);
  EndHourOptions = computed<SelectOption<string>[]>(() => {
    return this.StartHourOptions();
  });
  readonly durationOptions: SelectOption<number>[] = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '60 minutes', value: 60 },
  ];
  working_days = signal<WorkingDay[]>([
    { label: 'Saturday', value: 'Saturday', enabled: false },
    { label: 'Sunday', value: 'Sunday', enabled: false },
    { label: 'Monday', value: 'Monday', enabled: false },
    { label: 'Tuesday', value: 'Tuesday', enabled: false },
    { label: 'Wednesday', value: 'Wednesday', enabled: false },
    { label: 'Thursday', value: 'Thursday', enabled: false },
    { label: 'Friday', value: 'Friday', enabled: false },
  ]);
  startHour = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });
  endHour = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });
  duration = new FormControl<number>(30, { nonNullable: true, validators: [Validators.required] });
  price = new FormControl<number>(600, { nonNullable: true, validators: [Validators.required] });
  workingDays = new FormControl<string[]>([], {nonNullable: true,validators: [Validators.required],});

  scheduleData = new FormGroup({
    startHour: this.startHour,
    endHour: this.endHour,
    duration: this.duration,
    price: this.price,
    workingDays: this.workingDays,
  });
  editMode = signal(false);
  doSomthing(): void{ }
  }
