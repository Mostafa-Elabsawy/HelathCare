import { Component, effect, inject, signal, untracked } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { EditPersonalInfo } from '../edit-personal-info/edit-personal-info.component';
import { PatientService } from '../../../../services/patient.service';
import {
    PatientProfileResponseAPI,
    defaultPatientProfil,
} from '../../../../models/patient-api.interface';
@Component({
    selector: 'app-patient-info',
    imports: [ChipModule, EditPersonalInfo],
    templateUrl: './patient-info.component.html',
    styleUrl: './patient-info.component.css',
})
export class PatientInfo {
    patient = signal(defaultPatientProfil);
    patientService = inject(PatientService);

    constructor() {
        effect(() => {
            console.log('patient info changed');
            const profile = this.patientService.patient();
            untracked(() => this.patient.set(profile));
        });
    }

    formatDate(dateString: string): string {
        if(!dateString) return '';
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(dateString));
    }
}
