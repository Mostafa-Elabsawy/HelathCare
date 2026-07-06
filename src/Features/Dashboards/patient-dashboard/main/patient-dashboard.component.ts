import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PatientInfo } from '../patient-info/patient-info.component';
import { ButtonModule } from 'primeng/button';
import { LabResults } from '../lab-results/lab-results.component';
import { AuthService } from '../../../../services/Auth/login.service';

@Component({
  selector: 'app-patient-dashboard',
  imports: [RouterOutlet, ButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css',
})
export class PatientDashboard {
  menu = signal<boolean>(false);
  toggle() {
    this.menu.set(!this.menu());
  }
  authService = inject(AuthService);
  logout()
  {
    this.authService.logout();
  }
}
