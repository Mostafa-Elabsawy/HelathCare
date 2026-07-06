import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,ButtonDirective,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class Navbar {
  navbarCollapsed = signal<boolean>(true);

  toggleNavbar() {
    this.navbarCollapsed.set(!this.navbarCollapsed());
  }
}
