import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  RegisterPatientAPI,
  PatientProfileResponseAPI,
  UpdatePatientProfileAPI,
} from '../models/patient-api.interface';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly http = inject(HttpClient);
  private readonly patientRegistrationUrl = `${environment.apiUrl}/Patients`;

  // private patientSubject = new Subject<string>("nothing");
  //  Observable for components
  // patient$ = this.patientSubject.asObservable();
  // Refresh() {
  //   this.patientSubject.next('true');
  // }

  registerPatient(data: RegisterPatientAPI): Observable<any> {
    return this.http.post<any>(this.patientRegistrationUrl, data, {
      headers: { skipAuth: 'true' },
    });
  }
  updatePatientProfile(data: Partial<UpdatePatientProfileAPI>): Observable<any> {
    return this.http.put<any>(`${this.patientRegistrationUrl}/profile`, data, {});
  }
  getPatientProfile(): Observable<PatientProfileResponseAPI> {
    console.log(`${this.patientRegistrationUrl}/profile`);
    return this.http.get<PatientProfileResponseAPI>(`${this.patientRegistrationUrl}/profile`);
  }
  uploadProfileImage(image: File): Observable<any> {
    const formData = new FormData();
    // 'image' must match the parameter name expected by your backend
    formData.append('image', image);
    return this.http.post<string>(`${this.patientRegistrationUrl}/profile/upload-image`, formData);
  }
}
