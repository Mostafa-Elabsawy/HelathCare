import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginAPI, LoginResponseAPI } from '../../services/models/auth.interface';
import { environment } from '../../environments/environment';
import{Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly authUrl = `${environment.apiUrl}/Auth/login`;
  router = inject(Router);

  user = signal<{role: string;token: string;logedIn: boolean;} | null>(null);

  token = computed(() => this.user()?.token ?? '');
  role = computed(() => this.user()?.role ?? '');
  loggedIn = computed(() => !!this.user()?.token);

  login(data: LoginAPI) {
    return this.http
      .post<LoginResponseAPI>(this.authUrl, data, {
        headers: { skipAuth: 'true' },
      })
      .pipe(
        tap((res) => {
          this.user.set({
            role: res.role,
            token: res.token,
            logedIn: true,
          });

          this.storeToken(res.token);
          this.storeUserRole(res.role);
        }),
      );
  }

  private storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  private storeUserRole(role: string) {
    localStorage.setItem('role', role);
  }
  private storeLoginState(logedIn: boolean) {
    localStorage.setItem('logedIn', logedIn.toString());
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
  getLoginState(): boolean {
    return localStorage.getItem('logedIn') === 'true';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('logedIn');
    this.user.set(null);
    this.router.navigate(['/login']);
  }
  constructor() {
    this.user.set({
      role: this.getUserRole() ?? '',
      token: this.getToken() ?? '',
      logedIn: this.getLoginState() ?? '',
    })

  }
}
