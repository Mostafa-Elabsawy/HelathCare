import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../environments/environment';

import {
  RegisterDoctorAPI,
  DoctorProfileResponseAPI,
  defaultDoctorProfile,
} from '../models/doctor-api.interface';

import { GetDoctorAppointments } from '../models/appointment-interface';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/Doctors`;
  private readonly appointmentsUrl = `${environment.apiUrl}/Appointments`;

  // ========================
  // State
  // ========================

  readonly doctor = signal<DoctorProfileResponseAPI>(defaultDoctorProfile);
  readonly appointments = signal<GetDoctorAppointments[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Optional computed signals

  readonly appointmentCount = computed(() => this.appointments().length);

  // ========================
  // API
  // ========================

  registerDoctor(data: RegisterDoctorAPI) {
    return this.http.post<RegisterDoctorAPI>(this.apiUrl, data, {
      headers: { skipAuth: 'true' },
    });
  }

  loadDoctorProfile(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<DoctorProfileResponseAPI>(`${this.apiUrl}/profile`).subscribe({
      next: (profile) => {
        this.doctor.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load profile');
        this.loading.set(false);
      },
    });
  }

  updateDoctorProfile(data: Partial<DoctorProfileResponseAPI>) {
    return this.http.put<DoctorProfileResponseAPI>(`${this.apiUrl}/profile`, data).pipe(
      tap({
        next: (updated) => {
          this.doctor.set(updated);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Failed to update profile');
        },
      }),
    );
  }

  loadAppointments(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<GetDoctorAppointments[]>(`${this.appointmentsUrl}/doctor/MyAppointments`)
      .subscribe({
        next: (appointments) => {
          console.log('Loaded appointments:', appointments);
          this.appointments.set(appointments);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Failed to load appointments');
          this.loading.set(false);
        },
      });
  }

  updateSchedule(data: Partial<DoctorProfileResponseAPI>) {
    return this.http.put<DoctorProfileResponseAPI>(`${this.apiUrl}/profile`, data).pipe(
      tap({
        next: (updated) => {
          this.doctor.set(updated);
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Failed to update schedule');
        },
      }),
    );
  }

  acceptAppointment(appointmentId: number):Observable<string> {
    return this.http.put(`${this.appointmentsUrl}/approve/${appointmentId}`, {},{responseType: 'text'}).pipe(
      tap(() => {
        this.appointments.update((list) =>
          list.map((a) => (a.appointmentId === appointmentId ? { ...a, state: 'Accepted' } : a)),
        );
      }),
    );
  }
  rejectAppointment(appointmentId: number) {
    return this.http.put<void>(`${this.appointmentsUrl}/reject/${appointmentId}`, null).pipe(
      tap(() => {
        this.appointments.update((list) =>
          list.map((a) => (a.appointmentId === appointmentId ? { ...a, state: 'Rejected' } : a)),
        );
      }),
    );
  }
  getAllDoctors():Observable<DoctorProfileResponseAPI[]>{
    return this.http.get<DoctorProfileResponseAPI[]>(`${this.apiUrl}/GetAllDoctors`,{headers:{skipAuth:'true'}});
  }
}