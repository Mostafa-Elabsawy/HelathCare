import { Component, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../services/login.service';
import { DoctorService } from '../../../../services/doctor.service';
import { SpinnerComponent } from '../../../spinner/spinner.component';

@Component({
    selector: 'app-doctor-dashboard',
    imports: [RouterOutlet, RouterLink, RouterLinkActive, SpinnerComponent],
    templateUrl: './doctor-dashboard.component.html',
})
export class DoctorDashboard {
    menu = signal<boolean>(false);
    authSerivec = inject(AuthService);
    doctorService = inject(DoctorService);

    doctorName = signal('Dr. Mostafa Ehab');
    doctorSpecialty = signal('Cardiology Consultant');
    loading = signal(false);
    error = signal<string | null>(null);

    logout() {
        this.authSerivec.logout();
    }

    toggle() {
        this.menu.set(!this.menu());
    }
    constructor(){
        this.doctorService.loadDoctorProfile();
        this.doctorService.loadAppointments();
    }
}
