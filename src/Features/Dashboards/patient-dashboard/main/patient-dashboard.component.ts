import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../services/login.service';
import { PatientService } from '../../../../services/patient.service';

@Component({
    selector: 'app-patient-dashboard',
    imports: [RouterOutlet, ButtonModule, RouterLink, RouterLinkActive],
    templateUrl: './patient-dashboard.component.html',
    styleUrl: './patient-dashboard.component.css',
})
export class PatientDashboard {
    menu = signal<boolean>(false);
    authService = inject(AuthService);
    patientService = inject(PatientService);

    toggle() {
        this.menu.set(!this.menu());
    }

    logout() {
        this.authService.logout();
    }

    constructor() {
        this.patientService.loadPatientProfile();
        this.patientService.loadPatientAppointments();
    }
}
