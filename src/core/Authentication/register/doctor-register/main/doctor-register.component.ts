import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { Personal } from '../personal/personal.component';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import {
    defaultPersonalData,
    PersonalDataSchema,
    ContatactDataSchema,
    defaultContactData,
    SecurityDataSchema,
    defaultSecurityData,
} from '../doctor-register.interface';
import { Contact } from '../contact/contact.component';
import { Security } from '../security/security.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointService } from '../../../../../services/break-point-observer.service';
import { RegisterDoctorAPI } from '../../../../../models/doctor-api.interface';
import { DoctorService } from '../../../../../services/doctor.service';
@Component({
    selector: 'app-doctor-register',
    imports: [
        AnimateOnScrollModule,
        StepperModule,
        ButtonModule,
        Personal,
        CommonModule,
        Contact,
        Security,
        ReactiveFormsModule,
    ],
    templateUrl: './doctor-register.component.html',
    styleUrl: './doctor-register.component.css',
})
export class DoctorRegister {
    breakpointService = inject(BreakpointService);
    fluidCheck: Signal<boolean> = computed(() => this.breakpointService.isMobile());
    activeStep = 1;
    validation = signal<boolean>(false);
    personaldata = signal<PersonalDataSchema>(defaultPersonalData);
    contactdata = signal<ContatactDataSchema>(defaultContactData);
    securitydata = signal<SecurityDataSchema>(defaultSecurityData);
    updateSignal<T>(data: T, signal: WritableSignal<T>) {
        signal.set(data);
        // console.log(signal());
    }
    UpdateData(data: any, signal: WritableSignal<any>, type: string) {
        if (type == 'personal') this.updateSignal<PersonalDataSchema>(data, signal);
        else if (type == 'contact') this.updateSignal<ContatactDataSchema>(data, signal);
        else if (type == 'security') this.updateSignal<SecurityDataSchema>(data, signal);
    }
    print(data: any) {
        // console.log(data.value, data.valid);
    }
    doctorService = inject(DoctorService);
    submitForm() {
        if (this.personaldata().valid && this.contactdata().valid && this.securitydata().valid) {
            // console.log(this.personaldata());
            // console.log(this.contactdata());
            // console.log(this.securitydata());
            let finalObject: RegisterDoctorAPI = {
                ...this.personaldata().value,
                ...this.contactdata().value,
                password: this.securitydata().value.password,
            };
            this.doctorService.registerDoctor(finalObject).subscribe({
                next: (res) => {
                    console.log(res);
                },
                error: (err) => {
                    console.log(err);
                },
            });
            console.log('finalobjec', finalObject);
        }
    }
}
