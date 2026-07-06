import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent {
  private router = inject(Router);

  // Using signals for any dynamic text if needed later
  readonly errorCode = signal('404');

  navigateHome(): void {
    this.router.navigate(['/']);
  }
}
