import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { LabService } from '../../../../services/lab.service';
import { AppointmentService } from '../../../../services/appointment.service';

@Component({
    selector: 'app-lab-checkout',
    imports: [CommonModule, ReactiveFormsModule, SelectModule, ButtonModule, DatePickerModule, RouterLink],
    templateUrl: './lab-checkout.component.html',
    styleUrl: './lab-checkout.component.css',
})
export class LabCheckoutComponent implements OnInit {
    private labService = inject(LabService);
    private appointmentService = inject(AppointmentService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    lab = signal<any | null>(null);
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

    testOptions = computed(() => {
        const fake = [
            { label: 'Complete Blood Count (CBC) - 150 EGP', value: 'CBC' },
            { label: 'Blood Sugar Test - 80 EGP', value: 'Blood Sugar' },
            { label: 'Lipid Profile - 200 EGP', value: 'Lipid Profile' },
            { label: 'Liver Function Test - 180 EGP', value: 'Liver Function' },
            { label: 'Kidney Function Test - 160 EGP', value: 'Kidney Function' },
            { label: 'Thyroid Profile - 250 EGP', value: 'Thyroid Profile' },
            { label: 'Vitamin D Test - 300 EGP', value: 'Vitamin D' },
            { label: 'Iron Studies - 220 EGP', value: 'Iron Studies' },
            { label: 'Urinalysis - 60 EGP', value: 'Urinalysis' },
            { label: 'ECG (Electrocardiogram) - 120 EGP', value: 'ECG' },
        ];
        const real = (this.lab()?.labTests ?? []).map((t: any) => ({ label: `${t.testName} - ${t.price} EGP`, value: t.testName }));
        const options = real.length > 0 ? real : fake;
        return [{ label: 'Select a test type', value: '', disabled: true }, ...options];
    });

    bookingForm = new FormGroup({
        selectedTest: new FormControl<string>('', [Validators.required]),
        appointmentDate: new FormControl<Date | null>(null, [Validators.required]),
        appointmentTime: new FormControl<string>('', [Validators.required]),
    });

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!id) {
            this.router.navigate(['/patient-hub/book-lab-test']);
            return;
        }
        this.loadLab(id);
    }

    private loadLab(id: number): void {
        this.loading.set(true);
        this.labService.getAllLabs().subscribe({
            next: (labs) => {
                const lab = labs.find((l: any) => l.id === id);
                if (lab) {
                    this.lab.set(lab);
                } else {
                    this.error.set('Laboratory not found.');
                }
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Failed to load laboratory details.');
                this.loading.set(false);
            },
        });
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

        const lab = this.lab();
        const formVal = this.bookingForm.value;
        if (!lab || !formVal.appointmentDate || !formVal.appointmentTime) return;

        const date = formVal.appointmentDate;
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        this.submitting.set(true);
        this.appointmentService.bookLabAppointment({
            labId: lab.id,
            date: dateStr,
            time: formVal.appointmentTime,
        }).subscribe({
            next: () => {
                this.submitting.set(false);
                this.success.set(true);
            },
            error: () => {
                this.submitting.set(false);
                this.error.set('Failed to book lab test. Please try again.');
            },
        });
    }
}
