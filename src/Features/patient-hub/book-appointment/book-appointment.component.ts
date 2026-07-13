import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { AppointmentService } from '../../../services/appointment.service';
import { DoctorProfileResponseAPI } from '../../../models/doctor-api.interface';

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  medicalLevel: string;
  gender: 'male' | 'female';
  workingDays: string[];
  workingHourStart: string;
  workingHourEnd: string;
  price: number;
  rating: number;
  reviewsCount: number;
  governorate: string;
  city: string;
  about: string;
}

@Component({
  selector: 'app-book-appointment',
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
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.css',
})
export class BookAppointmentComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);

  // State Signals
  doctors = signal<Doctor[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal<string>('');
  selectedSpecialty = signal<string | null>(null);
  selectedMedicalLevel = signal<string | null>(null);
  selectedDay = signal<string | null>(null);
  selectedGender = signal<string | null>(null);

  // Booking Modal States
  displayBookingDialog = signal<boolean>(false);
  selectedDoctorForBooking = signal<Doctor | null>(null);
  bookingSuccess = signal<boolean>(false);

  // Booking Form
  bookingForm = new FormGroup({
    appointmentDate: new FormControl<Date | null>(null, [Validators.required]),
    appointmentTime: new FormControl<string>('', [Validators.required]),
    patientName: new FormControl('', [Validators.required]),
    patientPhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    notes: new FormControl(''),
  });

  // Filter Options
  specialties = computed(() => {
    const unique = [...new Set(this.doctors().map(d => d.specialty).filter(Boolean))];
    return [{ label: 'All Specialties', value: null }, ...unique.map(s => ({ label: s, value: s }))];
  });

  medicalLevels = computed(() => {
    const unique = [...new Set(this.doctors().map(d => d.medicalLevel).filter(Boolean))];
    return [{ label: 'All Levels', value: null }, ...unique.map(l => ({ label: l, value: l }))];
  });

  daysOfWeek = [
    { label: 'Any Day', value: null },
    { label: 'Sunday', value: 'Sunday' },
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
  ];

  genders = [
    { label: 'All Genders', value: null },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];



  // Available slots for selected day (Mock Slots)
  availableTimeSlots: string[] = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', 
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
  ];

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.loading.set(true);
    this.error.set(null);
    this.doctorService.getAllDoctors().subscribe({
      next: (apiDoctors) => {
        this.doctors.set(apiDoctors.map(d => this.mapApiDoctor(d)));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load doctors. Please try again.');
        this.loading.set(false);
      },
    });
  }

  private mapApiDoctor(api: DoctorProfileResponseAPI): Doctor {
    return {
      id: api.id,
      firstName: api.firstName,
      lastName: api.lastName,
      specialty: api.specialty,
      medicalLevel: api.medicalLevel,
      gender: api.gender === 'male' || api.gender === 'female' ? api.gender : 'male',
      workingDays: api.workingDay ?? [],
      workingHourStart: api.workingHourStart ?? '--:--',
      workingHourEnd: api.workingHourEnd ?? '--:--',
      price: api.price ?? 0,
      rating: api.rate ?? 0,
      reviewsCount: 0,
      governorate: api.governorate,
      city: api.city,
      about: '',
    };
  }

  // Filtered and Sorted Doctors list
  filteredDoctors = computed(() => {
    let list = this.doctors();

    // 1. Search Query Filter (name/specialty/location)
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(doc => 
        doc.firstName.toLowerCase().includes(query) ||
        doc.lastName.toLowerCase().includes(query) ||
        doc.specialty.toLowerCase().includes(query) ||
        doc.city.toLowerCase().includes(query) ||
        doc.governorate.toLowerCase().includes(query)
      );
    }

    // 2. Specialty Filter
    const specialty = this.selectedSpecialty();
    if (specialty) {
      list = list.filter(doc => doc.specialty === specialty);
    }

    // 3. Medical Level Filter
    const medLevel = this.selectedMedicalLevel();
    if (medLevel) {
      list = list.filter(doc => doc.medicalLevel === medLevel);
    }

    // 4. Availability Day Filter
    const day = this.selectedDay();
    if (day) {
      list = list.filter(doc => doc.workingDays.includes(day));
    }

    // 5. Gender Filter
    const gender = this.selectedGender();
    if (gender) {
      list = list.filter(doc => doc.gender === gender);
    }

    return list;
  });

  // Open booking flow
  openBookingDialog(doctor: Doctor) {
    this.selectedDoctorForBooking.set(doctor);
    this.bookingSuccess.set(false);
    
    // Autofill with logged-in user's email (name/phone filled by patient)
    this.bookingForm.patchValue({
      appointmentDate: null,
      appointmentTime: '',
      patientName: '',
      patientPhone: '',
      notes: ''
    });
    this.bookingForm.markAsPristine();
    this.bookingForm.markAsUntouched();
    
    this.displayBookingDialog.set(true);
  }

  // Get weekday name from selected date
  getWeekdayName(date: Date | null): string {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  // Check if selected date corresponds to a day the doctor works
  isDoctorAvailableOnSelectedDate(): boolean {
    const doctor = this.selectedDoctorForBooking();
    const date = this.bookingForm.value.appointmentDate;
    if (!doctor || !date) return false;
    
    const selectedDayName = this.getWeekdayName(date);
    return doctor.workingDays.includes(selectedDayName);
  }

  // Confirm and submit booking via API
  submitBooking() {
    if (this.bookingForm.valid) {
      if (!this.isDoctorAvailableOnSelectedDate()) {
        this.bookingForm.get('appointmentDate')?.setErrors({ doctorUnavailable: true });
        return;
      }

      const formVal = this.bookingForm.value;
      const doctor = this.selectedDoctorForBooking();
      
      if (!doctor || !formVal.appointmentDate) return;

      const date = formVal.appointmentDate;
      const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

      this.appointmentService.bookAppointment({
        doctorId: doctor.id,
        date: dateStr,
        time: formVal.appointmentTime || '',
      }).subscribe({
        next: () => {
          this.bookingSuccess.set(true);
          setTimeout(() => {
            this.displayBookingDialog.set(false);
            this.bookingSuccess.set(false);
          }, 2500);
        },
        error: () => {
          // Optionally show error feedback
        },
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  // Helper validation styling
  isInvalid(controlName: string): boolean {
    const control = this.bookingForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
