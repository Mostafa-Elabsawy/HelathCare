import { Component } from '@angular/core';

@Component({
  selector: 'app-lab-upload',
  imports: [],
  templateUrl: './upload.component.html',
})
export class LabUpload {
  recentUploads = [
    {
      id: 1,
      patientName: 'Ahmed Hassan',
      testName: 'CBC Analysis',
      date: 'Today',
      lab: 'Alpha Lab',
      status: 'Pending Review' as const,
      type: 'vial' as const,
    },
    {
      id: 2,
      patientName: 'Mariam Ali',
      testName: 'Blood Glucose Test',
      date: 'Today',
      lab: 'Alpha Lab',
      status: 'Completed' as const,
      type: 'droplet' as const,
    },
    {
      id: 3,
      patientName: 'Omar Samir',
      testName: 'Lipid Profile',
      date: 'Yesterday',
      lab: 'Alpha Lab',
      status: 'Completed' as const,
      type: 'flask' as const,
    },
    {
      id: 4,
      patientName: 'Nour Adel',
      testName: 'Thyroid Panel',
      date: '13 Jul',
      lab: 'Alpha Lab',
      status: 'Pending Review' as const,
      type: 'vial' as const,
    },
  ];
}
