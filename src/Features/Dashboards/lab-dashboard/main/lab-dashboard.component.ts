import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../services/login.service';

@Component({
  selector: 'app-lab-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './lab-dashboard.component.html',
})
export class LabDashboard {
  menu = signal<boolean>(false);
  authSerivec = inject(AuthService);
  logout() {
    this.authSerivec.logout();
  }

  toggle() {
    this.menu.set(!this.menu());
  }
}
