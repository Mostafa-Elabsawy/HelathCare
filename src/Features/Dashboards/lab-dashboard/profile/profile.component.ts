import { Component, signal } from '@angular/core';
import { EditLabInfoComponent, LabProfileData } from '../edit/edit-lab-info.component';

@Component({
  selector: 'app-lab-profile',
  imports: [EditLabInfoComponent],
  templateUrl: './profile.component.html',
})
export class LabProfile {
  labData = signal<LabProfileData>({
    name: 'MedLab Analytics',
    email: 'contact@medlab.com',
    phone: '01001234567',
    governorate: 'Cairo',
    city: 'Cairo',
    address: '42 El Tahrir St, Downtown',
  });
}
