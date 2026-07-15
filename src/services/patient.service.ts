import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import {
    RegisterPatientAPI,
    PatientProfileResponseAPI,
    UpdatePatientProfileAPI,
    defaultPatientProfil,
} from '../models/patient-api.interface';
import { PatientAppointmentsAPI, PatientLabAppointments, FullPatientLabAppointmentAPI } from '../models/appointment-interface';
import { LabWithIdAPI, DEFAULT_LAB_TEST } from '../models/lab-api.interface';
import { LabResult, LabResultDisplay } from '../models/patient-api.interface';

@Injectable({
    providedIn: 'root',
})
export class PatientService {
    private readonly http = inject(HttpClient);
    private readonly patientURL = `${environment.apiUrl}/Patients`;
    private readonly appointmentsURL = `${environment.apiUrl}/Appointments`;
    private readonly labAppointmentsURL = `${environment.apiUrl}/LabAppointments`;

    readonly patient = signal<PatientProfileResponseAPI>(defaultPatientProfil);
    readonly appointments = signal<PatientAppointmentsAPI[]>([]);
    readonly labAppointments = signal<FullPatientLabAppointmentAPI[]>([]);
    readonly labResults = signal<LabResultDisplay[]>([]);
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
    getAllLabAppointments(): Observable<FullPatientLabAppointmentAPI[]> {
        return this.http.get<PatientLabAppointments[]>(`${this.labAppointmentsURL}/patient/MyAppointments`).pipe(
            switchMap((appointments) =>
                appointments.length
                    ? forkJoin(
                          appointments.map((appointment) =>
                              this.http
                                  .get<LabWithIdAPI>(`${environment.apiUrl}/Lab/${appointment.labId}`)
                                  .pipe(
                                      map((lab) => {
                                          const dateObj = new Date(appointment.date);
                                          const time = dateObj.toTimeString().slice(0, 5);
                                          const firstTest = lab.tests?.[0] ?? DEFAULT_LAB_TEST;
                                          
                                          return {
                                              ...appointment,
                                              ...lab,
                                              time,
                                              testName: firstTest.testName,
                                              price: firstTest.price,
                                          } as FullPatientLabAppointmentAPI;
                                      }),
                                  ),
                          ),
                      )
                    : of([]),
            ),
        );
    }

    loadLabAppointments(): void {
        this.loading.set(true);
        this.error.set(null);
        this.getAllLabAppointments().subscribe({
            next: (appointments) => {
                this.labAppointments.set(appointments);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? 'Failed to load lab appointments');
                this.loading.set(false);
            },
        });
    }
    loadLabResults(): void {
        this.http.get<LabResult[]>(`${environment.apiUrl}/Patients/my-LabResults`)
            .pipe(
                map((results) => {
                    const appointments = this.labAppointments();
                    return results.map((r) => {
                        const raw = Object.assign(new LabResult(), r);
                        const match = appointments.find((a) => a.id === r.id);
                        return {
                            title: match?.testName ?? raw.testName ?? 'Lab Result',
                            date: raw.uploadedAt.split('T')[0],
                            link: raw.link,
                        } as LabResultDisplay;
                    });
                }),
            )
            .subscribe({
                next: (display) => {
                    this.labResults.set(display);
                },
                error: (err) => {
                    this.error.set(err?.error?.message ?? 'Failed to load lab results');
                },
            });
    }
}
