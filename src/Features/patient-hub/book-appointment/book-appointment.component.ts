import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { RouterLink } from '@angular/router';

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
  // State Signals
  doctors = signal<Doctor[]>([]);
  searchQuery = signal<string>('');
  selectedSpecialty = signal<string | null>(null);
  selectedDay = signal<string | null>(null);
  selectedGender = signal<string | null>(null);
  selectedRating = signal<number | null>(null);
  sortBy = signal<string>('rating'); // 'rating' | 'priceAsc' | 'priceDesc'

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
  specialties = [
    { label: 'All Specialties', value: null },
    { label: 'Cardiology', value: 'Cardiology' },
    { label: 'Dermatology', value: 'Dermatology' },
    { label: 'General Medicine', value: 'General Medicine' },
    { label: 'Internal Medicine', value: 'Internal Medicine' },
    { label: 'Neurology', value: 'Neurology' },
    { label: 'Orthopedics', value: 'Orthopedics' },
    { label: 'Pediatrics', value: 'Pediatrics' },
    { label: 'Gynecology & Obstetrics', value: 'Gynecology & Obstetrics' },
    { label: 'Dentistry', value: 'Dentistry' },
  ];

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

  ratings = [
    { label: 'Any Rating', value: null },
    { label: '4.8 ★ & Above', value: 4.8 },
    { label: '4.5 ★ & Above', value: 4.5 },
    { label: '4.0 ★ & Above', value: 4.0 },
  ];

  sortOptions = [
    { label: 'Top Rated', value: 'rating' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
  ];

  // Available slots for selected day (Mock Slots)
  availableTimeSlots: string[] = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', 
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'
  ];

  ngOnInit() {
    // Populate rich mock data
    this.doctors.set([
      {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Mansour',
        specialty: 'Cardiology',
        medicalLevel: 'Consultant',
        gender: 'male',
        workingDays: ['Sunday', 'Tuesday', 'Thursday'],
        workingHourStart: '09:00 AM',
        workingHourEnd: '05:00 PM',
        price: 500,
        rating: 4.9,
        reviewsCount: 142,
        governorate: 'Cairo',
        city: 'Maadi',
        about: 'Senior Consultant of Cardiology with over 15 years of experience in managing chronic cardiovascular disorders.'
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Hassan',
        specialty: 'Dermatology',
        medicalLevel: 'Specialist',
        gender: 'female',
        workingDays: ['Monday', 'Wednesday', 'Saturday'],
        workingHourStart: '10:00 AM',
        workingHourEnd: '06:00 PM',
        price: 350,
        rating: 4.8,
        reviewsCount: 96,
        governorate: 'Alexandria',
        city: 'Smouha',
        about: 'Expert clinical and cosmetic dermatologist specializing in advanced skin therapies and laser treatments.'
      },
      {
        id: 3,
        firstName: 'Mahmoud',
        lastName: 'El-Khouly',
        specialty: 'Orthopedics',
        medicalLevel: 'Consultant',
        gender: 'male',
        workingDays: ['Sunday', 'Monday', 'Wednesday'],
        workingHourStart: '11:00 AM',
        workingHourEnd: '07:00 PM',
        price: 600,
        rating: 4.7,
        reviewsCount: 110,
        governorate: 'Giza',
        city: 'Dokki',
        about: 'Joint replacement specialist and orthopedic consultant focused on arthroscopy and sports injuries.'
      },
      {
        id: 4,
        firstName: 'Nour',
        lastName: 'Al-Farabi',
        specialty: 'Pediatrics',
        medicalLevel: 'Specialist',
        gender: 'female',
        workingDays: ['Tuesday', 'Thursday', 'Friday'],
        workingHourStart: '01:00 PM',
        workingHourEnd: '08:00 PM',
        price: 300,
        rating: 4.9,
        reviewsCount: 165,
        governorate: 'Cairo',
        city: 'Heliopolis',
        about: 'Dedicated pediatrician offering comprehensive neonatal care and developmental growth monitoring.'
      },
      {
        id: 5,
        firstName: 'Sherif',
        lastName: 'Abdel-Aziz',
        specialty: 'Neurology',
        medicalLevel: 'Consultant',
        gender: 'male',
        workingDays: ['Monday', 'Wednesday', 'Thursday'],
        workingHourStart: '10:00 AM',
        workingHourEnd: '04:00 PM',
        price: 550,
        rating: 4.6,
        reviewsCount: 78,
        governorate: 'Alexandria',
        city: 'Kafr Abdo',
        about: 'Neurologist specialized in headache management, neurodegenerative disorders, and stroke rehabilitation.'
      },
      {
        id: 6,
        firstName: 'Laila',
        lastName: 'Salem',
        specialty: 'Gynecology & Obstetrics',
        medicalLevel: 'Consultant',
        gender: 'female',
        workingDays: ['Sunday', 'Tuesday', 'Wednesday'],
        workingHourStart: '09:00 AM',
        workingHourEnd: '03:00 PM',
        price: 450,
        rating: 4.8,
        reviewsCount: 130,
        governorate: 'Giza',
        city: '6th of October',
        about: 'Consultant in fetal medicine, maternal care, and advanced obstetric healthcare.'
      },
      {
        id: 7,
        firstName: 'Omar',
        lastName: 'Farouk',
        specialty: 'Dentistry',
        medicalLevel: 'Specialist',
        gender: 'male',
        workingDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
        workingHourStart: '12:00 PM',
        workingHourEnd: '09:00 PM',
        price: 400,
        rating: 4.5,
        reviewsCount: 88,
        governorate: 'Cairo',
        city: 'Nasr City',
        about: 'Cosmetic dentist and implant specialist utilizing modern techniques in root canal therapies and teeth whitening.'
      }
    ]);
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

    // 3. Availability Day Filter
    const day = this.selectedDay();
    if (day) {
      list = list.filter(doc => doc.workingDays.includes(day));
    }

    // 4. Gender Filter
    const gender = this.selectedGender();
    if (gender) {
      list = list.filter(doc => doc.gender === gender);
    }

    // 5. Rating Filter
    const rating = this.selectedRating();
    if (rating) {
      list = list.filter(doc => doc.rating >= rating);
    }

    // 6. Sorting
    const sort = this.sortBy();
    list = [...list]; // clone before sorting
    if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'priceAsc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDesc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  });

  // Open booking flow
  openBookingDialog(doctor: Doctor) {
    this.selectedDoctorForBooking.set(doctor);
    this.bookingSuccess.set(false);
    
    // Autofill default template details
    this.bookingForm.patchValue({
      appointmentDate: null,
      appointmentTime: '',
      patientName: 'Mostafa Elabsawy', // prefilled mock logged-in patient
      patientPhone: '01012345678',
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

  // Confirm and submit mock booking
  submitBooking() {
    if (this.bookingForm.valid) {
      if (!this.isDoctorAvailableOnSelectedDate()) {
        // Set custom error on date control
        this.bookingForm.get('appointmentDate')?.setErrors({ doctorUnavailable: true });
        return;
      }

      const formVal = this.bookingForm.value;
      const doctor = this.selectedDoctorForBooking();
      
      console.log('--- APPOINTMENT BOOKED ---');
      console.log('Doctor:', `Dr. ${doctor?.firstName} ${doctor?.lastName}`);
      console.log('Date:', formVal.appointmentDate);
      console.log('Time Slot:', formVal.appointmentTime);
      console.log('Patient:', formVal.patientName);
      console.log('Phone:', formVal.patientPhone);
      console.log('Notes:', formVal.notes);

      // Trigger success state
      this.bookingSuccess.set(true);
      
      // Close modal after brief delay to show booking success animation/message
      setTimeout(() => {
        this.displayBookingDialog.set(false);
        this.bookingSuccess.set(false);
      }, 2500);
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
