import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/login.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    authService = inject(AuthService);
    userEmail = this.authService.getUserEmail() || 'user@example.com';
    mobileMenuOpen = signal(false);

    toggleMobileMenu() {
        this.mobileMenuOpen.update((v) => !v);
    }
}
