import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../services/login.service';
import { DoctorService } from '../../../../services/doctor.service';

@Component({
    selector: 'app-doctor-dashboard',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './doctor-dashboard.component.html',
})
export class DoctorDashboard {
    menu = signal<boolean>(false);
    authSerivec = inject(AuthService);
    doctorService = inject(DoctorService);
    logout() {
        this.authSerivec.logout();
    }

    toggle() {
        this.menu.set(!this.menu());
    }
    constructor(){
        this.doctorService.loadDoctorProfile();
    }
}
