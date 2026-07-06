import { inject, Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDoctorAPI } from '../models/doctor-api.interface';
import { DoctorProfileResponseAPI } from '../models/doctor-api.interface';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private apiUrl = environment.apiUrl + '/Doctors';
  http = inject(HttpClient);
  registerDoctor(data: RegisterDoctorAPI): Observable<any> {
    return this.http.post<RegisterDoctorAPI>(this.apiUrl, data, { headers: { skipAuth: 'true' } });
  }
  getDoctorProfile(): Observable<DoctorProfileResponseAPI> {
    return this.http.get<DoctorProfileResponseAPI>(`${this.apiUrl}/profile`);
  }
  updateDoctorProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, data, {});
  }
}
