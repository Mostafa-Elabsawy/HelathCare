import { inject, Injectable, signal, computed } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { LabProfile, LabRegisterAPI, UpdateLabTestAPI } from '../models/lab-api.interface';
import {
    LabAppointmentsAPI,
    PatientWithIdAPI,
    FullLabAppointmentAPI,
} from '../models/lab-appointments.interface';

@Injectable({
    providedIn: 'root',
})
export class LabService {
    private readonly labURL = `${environment.apiUrl}/Lab`;
    private readonly appoinmentURL = `${environment.apiUrl}/LabAppointments`;
    http = inject(HttpClient);

    readonly lab = signal<LabProfile | null>(null);
    readonly appointments = signal<FullLabAppointmentAPI[]>([]);
    readonly tests = computed(() => this.lab()?.tests ?? []);

    registerLab(data: LabRegisterAPI): Observable<any> {
        return this.http.post<any>(this.labURL, data);
    }

    loadLabProfile(): void {
        this.http.get<LabProfile>(this.labURL + '/profile').subscribe({
            next: (profile) => this.lab.set(profile),
        });
    }

    updateLabProfile(data: any): Observable<any> {
        return this.http.put<any>(this.labURL + '/profile', data).pipe(
            tap((updated) => this.lab.set(updated)),
        );
    }

    updateTests(data: UpdateLabTestAPI) {
        return this.http.put<any>(this.labURL + '/profile', data).pipe(
            tap((updated) => this.lab.set(updated)),
        );
    }

    getAllLabs(): Observable<any[]> {
        return this.http.get<any[]>(this.labURL + '/GetAllLabs', {
            headers: { skipAuth: 'true' },
        });
    }

    loadLabAppointments(): void {
        this.http.get<LabAppointmentsAPI[]>(this.appoinmentURL + '/lab/MyAppointments')
            .pipe(
                switchMap((appointments) =>
                    forkJoin(
                        appointments.map((appointment) =>
                            this.http
                                .get<PatientWithIdAPI>(
                                    `${environment.apiUrl}/Patients/${appointment.patientId}`,
                                )
                                .pipe(
                                    map((patient): FullLabAppointmentAPI => {
                                        return {
                                            ...appointment,
                                            gender: patient.gender,
                                            firstName: patient.firstName,
                                            lastName: patient.lastName,
                                            phone: patient.phone,
                                        };
                                    }),
                                ),
                        ),
                    ),
                ),
            )
            .subscribe({
                next: (result) => this.appointments.set(result),
            });
    }

    uploadResult(report: File, patientId: number) {
        const formData = new FormData();
        formData.append('PatientId', patientId.toString());
        formData.append('PdfFile', report);
        return this.http.post<any>(`${this.labURL}/upload-result`, formData).pipe(
            tap(() => {
                this.appointments.update((list) =>
                    list.map((a) =>
                        a.patientId === patientId ? { ...a, status: 'Approved' } : a,
                    ),
                );
            }),
        );
    }

    loadAll(): void {
        this.loadLabProfile();
        this.loadLabAppointments();
    }
}
