import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ButtonDirective, ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar.component';
import { Hero } from '../hero/hero.component';
import { Cta } from '../cta/cta.component';
import { About } from '../about/about.component';
import { Services } from '../services/services.component';

@Component({
  selector: 'app-home',
  imports: [About, ButtonModule, CommonModule, Navbar, Hero, Cta, Services],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class Home {
  navbarCollapsed = signal<boolean>(true);

  toggleNavbar() {
    this.navbarCollapsed.set(!this.navbarCollapsed());
  }
}
