import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
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
    FormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.css',
})
export class BookAppointmentComponent implements OnInit {
  private doctorService = inject(DoctorService);

  doctors = signal<Doctor[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal<string>('');
  selectedSpecialty = signal<string | null>(null);
  selectedMedicalLevel = signal<string | null>(null);
  selectedDay = signal<string | null>(null);
  selectedGender = signal<string | null>(null);

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

}
