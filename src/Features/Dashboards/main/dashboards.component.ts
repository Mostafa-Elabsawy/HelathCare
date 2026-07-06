import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/Auth/login.service';


@Component({
  selector: 'app-dashboards',
  imports: [RouterOutlet],
  templateUrl: './dashboards.component.html',
  styleUrl: './dashboards.component.css',
})
export class DashboardsComponent {
  router = inject(Router);
  authService = inject(AuthService);
  RoleType=signal<string>("");
  constructor()
  {
    effect(()=>{
      let currentRole = this.authService.role();
      console.log("user = ", this.authService.user());

      if (currentRole)
      {
        console.log("role = ",currentRole);
        this.router.navigate([`/dashboard/${currentRole.toLowerCase()}`], { replaceUrl: true }); 
      }
      else
      {
        this.router.navigate(['/unauthorized'],{ replaceUrl: true });
      }
    })
  }
  
}
