import { Component, inject } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Router } from '@angular/router';
import { LoginAPI, LoginResponseAPI } from '../../../models/auth.interface';
import { AuthService } from '../../../services/login.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

type RoleType = 'patient' | 'doctor' | 'lab';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        ReactiveFormsModule,
        ButtonDirective,
        RadioButtonModule,
        ToastModule,
    ],
    providers: [MessageService],
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
    messageService = inject(MessageService);
    onSubmit() {
        const data: LoginAPI = this.loginData.getRawValue();
        this.loginService.login(data).subscribe({
            next: (res: LoginResponseAPI) => {
                this.messageService.add({ severity: 'success', summary: 'Welcome', detail: 'Login successful!' });
                setTimeout(() => this.router.navigate(['/dashboard']), 1000);
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: err.error?.message || 'Invalid credentials. Please try again.' });
            },
        });
    }
}
