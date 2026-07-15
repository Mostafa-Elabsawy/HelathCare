import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Button } from "primeng/button";
import { PatientService } from '../../../../services/patient.service';

@Component({
  selector: 'app-lab-results',
  imports: [CommonModule, Button],
  templateUrl: './lab-results.component.html',
  styleUrl: './lab-results.component.css',
})
export class LabResults {
  private patientService = inject(PatientService);
  labReports = this.patientService.labResults;
}
