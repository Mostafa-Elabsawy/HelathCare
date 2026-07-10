import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal,
    untracked,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { SelectOption, WorkingDay, Hours } from './schedule.interface';
import { Dialog } from 'primeng/dialog';
import { DoctorService } from '../../../../services/doctor.service';

@Component({
    selector: 'app-doctor-schedule',
    imports: [ButtonModule, InputNumberModule, SelectModule, ReactiveFormsModule, Dialog],
    templateUrl: './schedule.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorSchedule {
    private doctorService = inject(DoctorService);

    StartHourOptions = signal<SelectOption<string>[]>(Hours);
    EndHourOptions = signal<SelectOption<string>[]>(Hours);

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
    startHour = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
    });
    endHour = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });
    duration = new FormControl<number>(30, {
        nonNullable: true,
        validators: [Validators.required],
    });
    price = new FormControl<number>(600, { nonNullable: true, validators: [Validators.required] });
    workingDays = new FormControl<string[]>([], {
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

    weeklySlots = signal<number>(0);

    computeWorkingSlots() {
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

    computeEndHoursOptions() {
        let currStart = this.startHour.value;
        let startIndex = Hours.findIndex((hour) => hour.value == currStart);
        return Hours.slice(startIndex + 1);
    }

    constructor() {
        effect(() => {
            const profile = this.doctorService.doctor();

            untracked(() => {
                if (!profile) return;
                this.scheduleData.patchValue({
                    startHour: profile.workingHourStart ?? '',
                    endHour: profile.workingHourEnd ?? '',
                    duration: profile.duration ?? 30,
                    price: profile.price ?? 600,
                    workingDays: profile.workingDay ?? [],
                });
                console.log(profile);

                this.working_days.set(
                    this.working_days().map((day) => ({
                        ...day,
                        enabled: profile.workingDay.includes(day.value),
                    })),
                );
            });
        });
        this.startHour.valueChanges.subscribe((value) => {
            this.EndHourOptions.set(this.computeEndHoursOptions());
            this.weeklySlots.set(this.computeWorkingSlots());
        });
        this.endHour.valueChanges.subscribe((value) => {
            this.weeklySlots.set(this.computeWorkingSlots());
        });
        this.duration.valueChanges.subscribe((value) => {
            this.weeklySlots.set(this.computeWorkingSlots());
        });
        this.workingDays.valueChanges.subscribe((value) => {
            this.weeklySlots.set(this.computeWorkingSlots());
        });
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
        this.doctorService
            .updateSchedule({
                workingDay: this.workingDays.value,
                workingHourStart: this.startHour.value,
                workingHourEnd: this.endHour.value,
                duration: this.duration.value,
                price: this.price.value,
            })
            .subscribe({
                next: () => this.editMode.set(false),
                error: (err) => console.error(err),
            });
    }

    cancelEdit(): void {
        const profile = this.doctorService.doctor();
        this.scheduleData.patchValue({
            startHour: profile.workingHourStart ?? '',
            endHour: profile.workingHourEnd ?? '',
            duration: profile.duration ?? 30,
            price: profile.price ?? 600,
            workingDays: profile.workingDay ?? [],
        });
        this.editMode.set(false);
    }
}
