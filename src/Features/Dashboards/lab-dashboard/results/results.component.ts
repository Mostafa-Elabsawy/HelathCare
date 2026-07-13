import { Component, computed, inject } from '@angular/core';
import { LabService } from '../../../../services/lab.service';
import { formatDate } from '../../../../utils/date-format';

interface CompletedResult {
  id: number;
  patientName: string;
  testName: string;
  date: string;
  status: 'Reviewed' | 'Pending Review';
  type: 'vial' | 'droplet' | 'flask';
  orderedBy: string;
}

@Component({
  selector: 'app-lab-results',
  imports: [],
  templateUrl: './results.component.html',
})
export class LabResultsView {
  private labService = inject(LabService);

  results = computed<CompletedResult[]>(() =>
    this.labService.appointments()
      .filter((a) => a.status === 'Approved')
      .map((a) => ({
        id: a.id,
        patientName: `${a.firstName} ${a.lastName}`,
        testName: a.testName ?? '',
        date: formatDate(a.date),
        status: 'Reviewed' as const,
        type: 'vial' as const,
        orderedBy: '',
      })),
  );

  totalReviewed = computed(() => this.results().filter((r) => r.status === 'Reviewed').length);
  totalPendingReview = computed(() => this.results().filter((r) => r.status === 'Pending Review').length);
}
