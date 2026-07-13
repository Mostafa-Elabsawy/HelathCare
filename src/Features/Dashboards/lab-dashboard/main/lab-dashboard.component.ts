import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../services/login.service';
import { LabService } from '../../../../services/lab.service';

@Component({
  selector: 'app-lab-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './lab-dashboard.component.html',
})
export class LabDashboard implements OnInit {
  menu = signal<boolean>(false);
  authSerivec = inject(AuthService);
  private labService = inject(LabService);
  labData = this.labService.lab;

  ngOnInit() {
    this.labService.loadAll();
  }

  logout() {
    this.authSerivec.logout();
  }

  toggle() {
    this.menu.set(!this.menu());
  }
}
