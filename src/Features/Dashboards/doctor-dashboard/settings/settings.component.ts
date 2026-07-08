import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageModule } from 'primeng/image';
import { EditDoctorInfoComponent } from '../edit/edit-doctor-info.component';
import { DoctorService } from '../../../../services/doctor.service';
import { DoctorProfileResponseAPI } from '../../../../models/doctor-api.interface';
@Component({
    selector: 'app-doctor-settings',
    imports: [ImageModule, EditDoctorInfoComponent],
    templateUrl: './settings.component.html',
})
export class DoctorSettings {
    doctorService = inject(DoctorService);
    doctorData = signal<DoctorProfileResponseAPI>({
        id: 6,
        firstName: 'Ahmed',
        lastName: 'Hassan',

        gender: 'male',
        nationalID: 1234567890,

        specialty: 'General Practitioner',
        medicalLevel: 'General',
        price: 300,
        rate: 4.7,

        picture: null,

        phone: '+20 100 452 9910',
        email: 'H0xYI@example.com',

        governorate: 'Cairo',
        city: 'Cairo',
        address: '123 Main St',

        workingDay: ['Sunday', 'Monday', 'Wednesday'],
        workingHourStart: '09:00',
        workingHourEnd: '17:00',
        duration: 30,

        appointments: [],

        passwordHash: '',
        role: 'Doctor',
    });
    // loadDoctor() {
    //   this.doctorService.getDoctorProfile().subscribe({
    //     next: (res: DoctorProfileResponseAPI) => {
    //       this.doctorData.set(res);
    //     },
    //   });
    // }
    // constructor() {
    //   this.loadDoctor();
    // }
}
