import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, tap } from 'rxjs';
import {
    RegisterPatientAPI,
    PatientProfileResponseAPI,
    UpdatePatientProfileAPI,
    defaultPatientProfil,
} from '../models/patient-api.interface';
import { PatientAppointmentsAPI } from '../models/appointment-interface';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    private readonly http = inject(HttpClient);
    private readonly patientURL = `${environment.apiUrl}/Patients`;
    private readonly appointmentsURL = `${environment.apiUrl}/Appointments`;

    readonly patient = signal<PatientProfileResponseAPI>(defaultPatientProfil);
    readonly appointments = signal<PatientAppointmentsAPI[]>([]);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    registerPatient(data: RegisterPatientAPI): Observable<any> {
        return this.http.post<any>(this.patientURL, data, {
            headers: { skipAuth: 'true' },
        });
    }

    loadPatientProfile(): void {
        this.loading.set(true);
        this.error.set(null);
        this.http.get<PatientProfileResponseAPI>(`${this.patientURL}/profile`).subscribe({
            next: (profile) => {
                this.patient.set(profile);
                this.loading.set(false);
            },

            error: (err) => {
                this.error.set(err?.error?.message ?? 'Failed to load profile');
                this.loading.set(false);
            },
        });
    }

    loadPatientAppointments(): void {
        this.loading.set(true);
        this.error.set(null);
        this.http.get<PatientAppointmentsAPI[]>(`${this.appointmentsURL}/patient/MyAppointments`).subscribe({
            next: (appointments) => {
                this.appointments.set(appointments);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'Failed to load appointments');
                this.loading.set(false);
            },
        });
    }

    updatePatientProfile(data: Partial<UpdatePatientProfileAPI>): Observable<any> {
        return this.http.put<any>(`${this.patientURL}/profile`, data).pipe(
            tap({
                next: (updated) => this.patient.set(updated),
                error: (err) => {
                    this.error.set(err?.error?.message ?? 'Failed to update profile');
                },
            }),
        );
    }

    getPatientProfile(): Observable<PatientProfileResponseAPI> {
        return this.http.get<PatientProfileResponseAPI>(`${this.patientURL}/profile`);
    }

    uploadProfileImage(image: File):Observable<any> {
        const formData = new FormData();
        formData.append('file', image);
        return this.http.post<string>(`${this.patientURL}/upload-picture`, formData);
    }

    getPatientAppointments(): Observable<PatientAppointmentsAPI[]> {
        return this.http.get<PatientAppointmentsAPI[]>(`${this.appointmentsURL}/patient/MyAppointments`);
    }
    getAvailbelSlots(date:string): Observable<any> 
    {

        return this.http.get<[string]>(`${this.appointmentsURL}/available-slots`);

    }
}
