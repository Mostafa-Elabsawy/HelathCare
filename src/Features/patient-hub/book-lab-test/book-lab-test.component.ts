import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { RouterLink } from '@angular/router';
import { LabService } from '../../../services/lab.service';
import { AppointmentService } from '../../../services/appointment.service';

export interface Lab {
  id: number;
  name: string;
  city: string;
  governorate: string;
  testsCount: number;
  openingTime: string;
  closingTime: string;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  about: string;
  testCategories: string[];
  picture: string | null;
}

@Component({
  selector: 'app-book-lab-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    DatePickerModule,
    RouterLink
  ],
  templateUrl: './book-lab-test.component.html',
  styleUrl: './book-lab-test.component.css',
})
export class BookLabTestComponent implements OnInit {
  private labService = inject(LabService);
  private appointmentService = inject(AppointmentService);

  labs = signal<Lab[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal<string>('');
  selectedTestCategory = signal<string | null>(null);
  selectedCity = signal<string | null>(null);

  displayBookingDialog = signal<boolean>(false);
  selectedLabForBooking = signal<Lab | null>(null);
  bookingSuccess = signal<boolean>(false);

  bookingForm = new FormGroup({
    testDate: new FormControl<Date | null>(null, [Validators.required]),
    testTime: new FormControl<string>('', [Validators.required]),
    patientName: new FormControl('', [Validators.required]),
    patientPhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    selectedTest: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  testCategories = computed(() => {
    const unique = [...new Set(this.labs().flatMap(l => l.testCategories).filter(Boolean))];
    return [{ label: 'All Tests', value: null }, ...unique.map(c => ({ label: c, value: c }))];
  });

  cities = computed(() => {
    const unique = [...new Set(this.labs().map(l => l.city).filter(Boolean))];
    return [{ label: 'All Cities', value: null }, ...unique.map(c => ({ label: c, value: c }))];
  });

  availableTimeSlots: string[] = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  ];

  ngOnInit() {
    this.loadLabs();
  }

  loadLabs() {
    this.loading.set(true);
    this.error.set(null);
    this.labService.getAllLabs().subscribe({
      next: (apiLabs) => {
        this.labs.set(apiLabs.map((l: any) => this.mapApiLab(l)));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load labs. Please try again.');
        this.loading.set(false);
      },
    });
  }

  private mapApiLab(api: any): Lab {
    const tests = api.labTests ?? [];
    const categories = tests.map((t: any) => t.testName).filter(Boolean);
    const prices = tests.map((t: any) => t.price).filter((p: any) => p != null);
    return {
      id: api.id,
      name: api.name,
      city: api.city,
      governorate: api.governorate,
      testsCount: tests.length,
      openingTime: api.workingHourStart ?? '--:--',
      closingTime: api.workingHourEnd ?? '--:--',
      basePrice: prices.length ? Math.min(...prices) : 0,
      rating: 0,
      reviewsCount: 0,
      about: '',
      testCategories: categories,
      picture: api.picture ?? null,
    };
  }

  filteredLabs = computed(() => {
    let list = this.labs();

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(lab =>
        lab.name.toLowerCase().includes(query) ||
        lab.city.toLowerCase().includes(query) ||
        lab.governorate.toLowerCase().includes(query) ||
        lab.testCategories.some(c => c.toLowerCase().includes(query))
      );
    }

    const category = this.selectedTestCategory();
    if (category) {
      list = list.filter(lab => lab.testCategories.includes(category));
    }

    const city = this.selectedCity();
    if (city) {
      list = list.filter(lab => lab.city === city || lab.governorate === city);
    }

    return list;
  });

  openBookingDialog(lab: Lab) {
    this.selectedLabForBooking.set(lab);
    this.bookingSuccess.set(false);
    this.bookingForm.patchValue({
      testDate: null,
      testTime: '',
      patientName: '',
      patientPhone: '',
      selectedTest: '',
      notes: '',
    });
    this.bookingForm.markAsPristine();
    this.bookingForm.markAsUntouched();
    this.displayBookingDialog.set(true);
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      const formVal = this.bookingForm.value;
      const lab = this.selectedLabForBooking();
      if (!lab || !formVal.testDate) return;

      const date = formVal.testDate;
      const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

      this.appointmentService.bookAppointment({
        doctorId: lab.id,
        date: dateStr,
        time: formVal.testTime || '',
      }).subscribe({
        next: () => {
          this.bookingSuccess.set(true);
          setTimeout(() => {
            this.displayBookingDialog.set(false);
            this.bookingSuccess.set(false);
          }, 2500);
        },
        error: () => {},
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.bookingForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
