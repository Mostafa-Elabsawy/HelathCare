import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Button } from "primeng/button";

@Component({
  selector: 'app-lab-results',
  imports: [CommonModule, Button],
  templateUrl: './lab-results.component.html',
  styleUrl: './lab-results.component.css',
})
export class LabResults {
  labReports = [
    {
      title: 'Complete Blood Count (CBC)',
      date: '2023-10-15',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=CBC+Report',
    },
    {
      title: 'Blood Glucose Test',
      date: '2023-10-12',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=Blood+Glucose',
    },
    {
      title: 'Lipid Profile Test',
      date: '2023-10-08',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=Lipid+Profile',
    },
    {
      title: 'Liver Function Test (LFT)',
      date: '2023-10-05',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=Liver+Function',
    },
    {
      title: 'Kidney Function Test (KFT)',
      date: '2023-10-02',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=Kidney+Function',
    },
    {
      title: 'Thyroid Function Test (TSH)',
      date: '2023-09-28',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=Thyroid+Test',
    },
    {
      title: 'Urinalysis Test',
      date: '2023-09-25',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=Urinalysis',
    },
    {
      title: 'Hemoglobin A1c (HbA1c)',
      date: '2023-09-20',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=HbA1c',
    },
    {
      title: 'Vitamin D Test',
      date: '2023-09-18',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=Vitamin+D',
    },
    {
      title: 'Calcium Blood Test',
      date: '2023-09-15',
      link: 'https://dummy-pdf-generator.vercel.app/api/pdf?text=Calcium+Test',
    },
  ];
}
