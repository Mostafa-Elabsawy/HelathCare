import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PostNewDoctorAppointment, PostNewLabAppointment } from '../models/appointment-interface';

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    private readonly http = inject(HttpClient);
    private readonly appointmentsUrl = `${environment.apiUrl}/Appointments`;
    private readonly testAppointmentUrl = `${environment.apiUrl}/LabAppointments`;

    bookDoctorAppointment(data: PostNewDoctorAppointment): Observable<any> {
      console.log(data);
      
        return this.http.post(`${this.appointmentsUrl}/CreateAppointment`, data);
    }
    bookLabAppointment(data: PostNewLabAppointment): Observable<any> {
        return this.http.post(`${this.testAppointmentUrl}/CreateAppointment`, data);
    }
}
