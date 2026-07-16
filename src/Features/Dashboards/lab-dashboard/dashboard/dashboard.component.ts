import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabService } from '../../../../services/lab.service';
import { formatDate, formatTime, isToday } from '../../../../utils/date-format';

@Component({
  selector: 'app-lab-dashboard-overview',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class LabDashboardOverview {
  private labService = inject(LabService);

  private appointments = this.labService.appointments;

  totalTestsToday = computed(() =>
    this.appointments().filter((a) => isToday(a.date)).length,
  );

  pendingResults = computed(() =>
    this.appointments().filter((a) => a.status === 'Pending').length,
  );

  completedToday = computed(() =>
    this.appointments().filter((a) => a.status === 'Approved' && isToday(a.date)).length,
  );

  patientsServed = computed(() =>
    new Set(this.appointments().map((a) => a.patientId)).size,
  );

  testRequests = computed(() =>
    this.appointments()
      .filter((a) => a.status === 'Pending')
      .map((a) => ({
        id: a.id,
        patientName: `${a.firstName} ${a.lastName}`,
        avatar: a.firstName.charAt(0),
        avatarColor: 'violet',
        phone: a.phone ?? '',
        date: formatDate(a.date),
        time: formatTime(a.date),
        testType: a.testName ?? 'General',
        urgency: 'normal' as const,
        status: 'pending' as const,
      })),
  );

  queue = computed(() =>
    this.appointments()
      .filter((a) => isToday(a.date))
      .map((a) => ({
        id: a.id,
        patientName: `${a.firstName} ${a.lastName}`,
        testName: a.testName ?? '',
        time: formatTime(a.date),
        lab: '',
        status: a.status,
      })),
  );

  acceptRequest(id: number) {
    this.labService.approveLabAppointments(id).subscribe();
  }

  declineRequest(id: number) {
    this.labService.rejectLabAppointments(id).subscribe();
  }
}
