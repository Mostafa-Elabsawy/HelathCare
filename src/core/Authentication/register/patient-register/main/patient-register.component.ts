import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Personal } from '../personal/personal.component';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { RegisterPatientAPI } from '../../../../../models/patient-api.interface';
import {
    defaultPersonalData,
    PersonalDataSchema,
    ContatactDataSchema,
    defaultContactData,
    MedicalDataSchema,
    defaultMeicalData,
    SecurityDataSchema,
    defaultSecurityData,
} from '../patient-register.interface';
import { Contact } from '../contact/contact.component';
import { Medical } from '../medical/medical.component';
import { Security } from '../security/security.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointService } from '../../../../../services/break-point-observer.service';
import { PatientService } from '../../../../../services/patient.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-patient-register',
    imports: [
        AnimateOnScrollModule,
        StepperModule,
        ButtonModule,
        Personal,
        NgClass,
        Contact,
        Medical,
        Security,
        ReactiveFormsModule,
        ToastModule,
    ],
    providers: [PatientService, MessageService],
    templateUrl: './patient-register.component.html',
    styleUrl: './patient-register.component.css',
})
export class PatientRegister {
    patientService = inject(PatientService);
    breakpointService = inject(BreakpointService);
    messageService = inject(MessageService);
    router = inject(Router);
    fluidCheck: Signal<boolean> = computed(() => this.breakpointService.isMobile());
    activeStep = 1;
    validation = signal<boolean>(false);
    personaldata = signal<PersonalDataSchema>(defaultPersonalData);
    contactdata = signal<ContatactDataSchema>(defaultContactData);
    medicaldata = signal<MedicalDataSchema>(defaultMeicalData);
    securitydata = signal<SecurityDataSchema>(defaultSecurityData);
    updateSignal<T>(data: T, signal: WritableSignal<T>) {
        signal.set(data);
        // console.log(signal());
    }
    UpdateData(data: any, signal: WritableSignal<any>, type: string) {
        if (type == 'personal') this.updateSignal<PersonalDataSchema>(data, signal);
        else if (type == 'contact') this.updateSignal<ContatactDataSchema>(data, signal);
        else if (type == 'medical') this.updateSignal<MedicalDataSchema>(data, signal);
        else if (type == 'security') this.updateSignal<SecurityDataSchema>(data, signal);
    }
    print(data: any) {
        // console.log(data.value, data.valid);
    }
    submitForm() {
        let finalObject: RegisterPatientAPI = {
            ...this.personaldata().value,
            ...this.contactdata().value,
            ...this.medicaldata().value,
            password: this.securitydata().value.password,
        };
        console.log(finalObject);
        this.patientService.registerPatient(finalObject).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful! Redirecting...' });
                setTimeout(() => this.router.navigate(['/login']), 1000);
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Registration failed. Please try again.' });
            },
        });
    }
}
