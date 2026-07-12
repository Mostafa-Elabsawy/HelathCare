import {
    ChangeDetectionStrategy,
    Component,
    computed,
    signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { SelectOption, WorkingDay, Hours } from './schedule.interface';
import { Dialog } from 'primeng/dialog';

@Component({
    selector: 'app-lab-schedule',
    imports: [ButtonModule, InputNumberModule, SelectModule, ReactiveFormsModule, Dialog],
    templateUrl: './schedule.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabSchedule {
    StartHourOptions = signal<SelectOption<string>[]>(Hours);
    EndHourOptions = signal<SelectOption<string>[]>(Hours);

    readonly durationOptions: SelectOption<number>[] = [
        { label: '15 minutes', value: 15 },
        { label: '30 minutes', value: 30 },
        { label: '45 minutes', value: 45 },
        { label: '60 minutes', value: 60 },
    ];
    working_days = signal<WorkingDay[]>([
        { label: 'Saturday', value: 'Saturday', enabled: true },
        { label: 'Sunday', value: 'Sunday', enabled: true },
        { label: 'Monday', value: 'Monday', enabled: true },
        { label: 'Tuesday', value: 'Tuesday', enabled: true },
        { label: 'Wednesday', value: 'Wednesday', enabled: true },
        { label: 'Thursday', value: 'Thursday', enabled: true },
        { label: 'Friday', value: 'Friday', enabled: false },
    ]);
    startHour = new FormControl<string>('09:00', {
        nonNullable: true,
        validators: [Validators.required],
    });
    endHour = new FormControl<string>('17:00', { nonNullable: true, validators: [Validators.required] });
    duration = new FormControl<number>(30, {
        nonNullable: true,
        validators: [Validators.required],
    });
    price = new FormControl<number>(300, { nonNullable: true, validators: [Validators.required] });
    workingDays = new FormControl<string[]>([
        'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    ], {
        nonNullable: true,
        validators: [Validators.required],
    });

    scheduleData = new FormGroup({
        startHour: this.startHour,
        endHour: this.endHour,
        duration: this.duration,
        price: this.price,
        workingDays: this.workingDays,
    });
    editMode = signal(false);
    saved = signal(false);

    weeklySlots = signal<number>(0);

    computeWorkingSlots(): number {
        const start = this.startHour.value;
        const end = this.endHour.value;
        const dur = this.duration.value;
        const days = this.workingDays.value.length;
        if (!start || !end || !dur || !days) return 0;
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const totalMinutes = eh * 60 + em - (sh * 60 + sm);
        return Math.floor(totalMinutes / dur) * days;
    }

    computeEndHoursOptions(): SelectOption<string>[] {
        const currStart = this.startHour.value;
        const startIndex = Hours.findIndex((hour) => hour.value === currStart);
        return Hours.slice(startIndex + 1);
    }

    constructor() {
        this.startHour.valueChanges.subscribe(() => {
            this.EndHourOptions.set(this.computeEndHoursOptions());
            this.weeklySlots.set(this.computeWorkingSlots());
        });
        this.endHour.valueChanges.subscribe(() => {
            this.weeklySlots.set(this.computeWorkingSlots());
        });
        this.duration.valueChanges.subscribe(() => {
            this.weeklySlots.set(this.computeWorkingSlots());
        });
        this.workingDays.valueChanges.subscribe(() => {
            this.weeklySlots.set(this.computeWorkingSlots());
        });
        this.weeklySlots.set(this.computeWorkingSlots());
    }

    formatHour(hour: string): string {
        if (!hour) return '--:--';
        const [h, m] = hour.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
    }

    toggleDay(dayValue: string): void {
        this.working_days.update((days) =>
            days.map((d) => (d.value === dayValue ? { ...d, enabled: !d.enabled } : d)),
        );
        this.workingDays.setValue(
            this.working_days()
                .filter((d) => d.enabled)
                .map((d) => d.value),
        );
    }

    saveSchedule(): void {
        if (this.scheduleData.invalid) {
            this.scheduleData.markAllAsTouched();
            return;
        }
        this.saved.set(true);
        this.editMode.set(false);
    }

    openEdit(): void {
        this.editMode.set(true);
        this.saved.set(false);
    }

    cancelEdit(): void {
        this.scheduleData.patchValue({
            startHour: '09:00',
            endHour: '17:00',
            duration: 30,
            price: 300,
            workingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        });
        this.working_days.set(
            this.working_days().map((day) => ({
                ...day,
                enabled: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(day.value),
            })),
        );
        this.editMode.set(false);
    }
}
