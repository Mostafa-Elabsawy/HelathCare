import { Component, inject } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton'; 
import { InputTextModule } from 'primeng/inputtext';
import { Validators } from '@angular/forms';
import { ButtonDirective } from "primeng/button";
import { Router } from '@angular/router';
import { LoginAPI , LoginResponseAPI} from "../../../services/models/auth.interface";
import { AuthService } from '../../../services/Auth/login.service';

type RoleType = 'patient' | 'doctor' | 'lab';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, InputTextModule, ReactiveFormsModule, ButtonDirective, RadioButtonModule],
  templateUrl: './login.component.html',
})
export class Login {
  name: string[] = ['mostafa'];

  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  password = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(8)],
  });
  role = new FormControl<RoleType>('patient', {
    nonNullable: true,
    validators: [Validators.required],
  });

  loginData = new FormGroup({
    email: this.email,
    password: this.password,
    role: this.role,
  });
  remember = false;
  router = inject(Router);
  loginService = inject(AuthService);
  onSubmit() {
    const data: LoginAPI = this.loginData.getRawValue();
    this.loginService.login(data).subscribe({
      next: (res: LoginResponseAPI) => {  
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
