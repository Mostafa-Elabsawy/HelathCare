import { Component, inject, signal } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { EditPersonalInfo } from '../edit-personal-info/edit-personal-info.component';
import { PatientService } from '../../../../services/Patient/patient.service';
import {
  PatientProfileResponseAPI,
  defaultPatientProfil,
} from '../../../../services/models/patient-api.interface';
@Component({
  selector: 'app-patient-info',
  imports: [ChipModule, EditPersonalInfo],
  templateUrl: './patient-info.component.html',
  styleUrl: './patient-info.component.css',
})
export class PatientInfo {
  patient = signal(defaultPatientProfil);
  service = inject(PatientService);
  loadPatientData() {
    this.service.getPatientProfile().subscribe({
      next: (res) => {
        this.patient.set(res);
        console.log(res);
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  constructor() {
    this.loadPatientData();
  }
  formatDate(dateString: string): string {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  }
}
