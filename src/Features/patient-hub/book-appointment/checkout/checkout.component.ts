import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../../services/doctor.service';
import { AppointmentService } from '../../../../services/appointment.service';
import { DoctorProfileResponseAPI } from '../../../../models/doctor-api.interface';

@Component({
    selector: 'app-checkout',
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, DatePickerModule, RouterLink],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
    private doctorService = inject(DoctorService);
    private appointmentService = inject(AppointmentService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    doctor = signal<DoctorProfileResponseAPI | null>(null);
    loading = signal(true);
    submitting = signal(false);
    success = signal(false);
    error = signal<string | null>(null);

    minDate: Date = new Date();

    availableTimeSlots: string[] = [
        '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30',
        '17:00', '17:30', '18:00', '18:30',
    ];

    bookingForm = new FormGroup({
        appointmentDate: new FormControl<Date | null>(null, [Validators.required]),
        appointmentTime: new FormControl<string>('', [Validators.required]),
    });

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) {
            this.router.navigate(['/patient-hub/book-appointment']);
            return;
        }
        this.loadDoctor(id);
    }

    private loadDoctor(id: number): void {
        this.loading.set(true);
        this.doctorService.getAllDoctors().subscribe({
            next: (docs) => {
                const doc = docs.find((d) => d.id === id);
                if (doc) {
                    this.doctor.set(doc);
                } else {
                    this.error.set('Doctor not found.');
                }
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Failed to load doctor details.');
                this.loading.set(false);
            },
        });
    }

    getWeekdayName(date: Date | null): string {
        if (!date) return '';
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    }

    isDoctorAvailableOnSelectedDate(): boolean {
        const doc = this.doctor();
        const date = this.bookingForm.value.appointmentDate;
        if (!doc || !date) return false;
        const dayName = this.getWeekdayName(date);
        return (doc.workingDay ?? []).includes(dayName);
    }

    isInvalid(controlName: string): boolean {
        const control = this.bookingForm.get(controlName);
        return !!(control && control.invalid && (control.touched || control.dirty));
    }

    submitBooking(): void {
        if (this.bookingForm.invalid) {
            this.bookingForm.markAllAsTouched();
            return;
        }
        if (!this.isDoctorAvailableOnSelectedDate()) {
            this.bookingForm.get('appointmentDate')?.setErrors({ doctorUnavailable: true });
            return;
        }

        const doc = this.doctor();
        const formVal = this.bookingForm.value;
        if (!doc || !formVal.appointmentDate || !formVal.appointmentTime) return;

        const date = formVal.appointmentDate;
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        this.submitting.set(true);
        this.appointmentService.bookDoctorAppointment({
            doctorId: doc.id,
            date: dateStr,
            time: formVal.appointmentTime,
        }).subscribe({
            next: (res) => {
                console.log(res);
                
                this.submitting.set(false);
                this.success.set(true);
            },
            error: (err) => {
                console.log(err);
                
                this.submitting.set(false);
                this.error.set('Failed to book appointment. Please try again.');
            },
        });
    }
}
