import { Component } from '@angular/core';

@Component({
  selector: 'app-lab-results',
  imports: [],
  templateUrl: './results.component.html',
})
export class LabResultsView {
  completedResults = [
    {
      id: 1,
      patientName: 'Ahmed Hassan',
      testName: 'Complete Blood Count',
      date: '06 Jul 2026',
      status: 'Reviewed' as const,
      type: 'vial' as const,
      orderedBy: 'Dr. Mostafa Ehab',
    },
    {
      id: 2,
      patientName: 'Mariam Ali',
      testName: 'Blood Glucose Test',
      date: '06 Jul 2026',
      status: 'Pending Review' as const,
      type: 'droplet' as const,
      orderedBy: 'Dr. Sara Khaled',
    },
    {
      id: 3,
      patientName: 'Omar Samir',
      testName: 'Lipid Profile',
      date: '05 Jul 2026',
      status: 'Reviewed' as const,
      type: 'flask' as const,
      orderedBy: 'Dr. Ahmed Nabil',
    },
    {
      id: 4,
      patientName: 'Nour Adel',
      testName: 'Thyroid Panel',
      date: '04 Jul 2026',
      status: 'Reviewed' as const,
      type: 'vial' as const,
      orderedBy: 'Dr. Mostafa Ehab',
    },
    {
      id: 5,
      patientName: 'Youssef Kareem',
      testName: 'Urinalysis',
      date: '03 Jul 2026',
      status: 'Pending Review' as const,
      type: 'flask' as const,
      orderedBy: 'Dr. Khaled Mahmoud',
    },
  ];
}
