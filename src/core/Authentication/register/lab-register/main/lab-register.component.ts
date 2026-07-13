import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import {
    defaultLabInformationsData,
    LabInformationsSchema,
    SecurityDataSchema,
    defaultSecurityData,
} from '../lab-register.interface';
import { LabInformationsComponent } from '../Lab-informations/lab-informations.component';
import { Security } from '../security/security.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BreakpointService } from '../../../../../services/break-point-observer.service';
import { LabRegisterAPI } from '../../../../../models/lab-api.interface';
import { LabService } from '../../../../../services/lab.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
    selector: 'app-lab-register',
    imports: [
        AnimateOnScrollModule,
        StepperModule,
        ButtonModule,
        NgClass,
        LabInformationsComponent,
        Security,
        ReactiveFormsModule,
        ToastModule,
    ],
    providers: [BreakpointService, MessageService],
    templateUrl: './lab-register.component.html',
    styleUrl: './lab-register.component.css',
})
export class LabRegister {
    breakpointService = inject(BreakpointService);
    labService = inject(LabService);
    messageService = inject(MessageService);
    fluidCheck: Signal<boolean> = computed(() => this.breakpointService.isMobile());
    title = new FormControl('');
    activeStep = 1;
    validation = signal<boolean>(false);
    labData = signal<LabInformationsSchema>(defaultLabInformationsData);
    securitydata = signal<SecurityDataSchema>(defaultSecurityData);
    updateSignal<T>(data: T, signal: WritableSignal<T>) {
        signal.set(data);
        // console.log(signal());
    }
    UpdateData(data: any, signal: WritableSignal<any>, type: string) {
        if (type == 'lab') this.updateSignal<LabInformationsSchema>(data, signal);
        else if (type == 'security') this.updateSignal<SecurityDataSchema>(data, signal);
    }
    print(data: any) {
        console.log(data.value, data.valid);
    }
    submitForm() {
        console.log(this.labData());
        console.log(this.securitydata());
        let finalObject: LabRegisterAPI = {
            ...this.labData().value,
            password: this.securitydata().value.password,
        };
        this.labService.registerLab(finalObject).subscribe({
            next: (res) => {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registration successful! Redirecting...' });
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Registration failed. Please try again.' });
            },
        });
    }
}
