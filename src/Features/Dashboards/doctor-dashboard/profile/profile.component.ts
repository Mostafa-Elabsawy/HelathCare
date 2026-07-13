import { Component, effect, inject, signal, untracked } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { EditDoctorInfoComponent } from '../edit/edit-doctor-info.component';
import { DoctorService } from '../../../../services/doctor.service';
import {DoctorProfileResponseAPI,defaultDoctorProfile} from "../../../../models/doctor-api.interface";
@Component({
    selector: 'app-doctor-settings',
    imports: [ImageModule, EditDoctorInfoComponent],
    templateUrl: './profile.component.html',
})
export class DoctorProfileComponent {
    doctorService = inject(DoctorService);
    doctorProfile =signal<DoctorProfileResponseAPI>(defaultDoctorProfile );
    doctor=signal<DoctorProfileResponseAPI>(defaultDoctorProfile );

    constructor() {
        effect(() => {
            console.log("value Changes");
            let currentDoctorData=this.doctorService.doctor();
            untracked(() => this.   doctorProfile.set(currentDoctorData));
        })
    }
}
