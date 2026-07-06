import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import type { MenuItem } from 'primeng/api';

type AppointmentStatus = 'Confirmed' | 'Completed' | 'Canceled';
type AppointmentPeriod = 'today' | 'upcoming';

interface DoctorAppointment {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  day: string;
  month: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  period: AppointmentPeriod;
}

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-blue-100 text-blue-700',
  Canceled: 'bg-red-100 text-red-600',
};

@Component({
  selector: 'app-doctor-appointments',
  imports: [DialogModule, SplitButtonModule],
  templateUrl: './appointments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorAppointments {
  readonly statuses: AppointmentStatus[] = ['Confirmed', 'Completed', 'Canceled'];
  readonly selectedStatus = signal<AppointmentStatus>('Confirmed');
  readonly selectedAppointment = signal<DoctorAppointment | null>(null);
  readonly detailsVisible = signal(false);

  readonly appointments = signal<DoctorAppointment[]>([
    {
      id: 1,
      patientName: 'Ahmed Hassan',
      patientAge: 48,
      patientGender: 'Male',
      patientPhone: '+20 100 452 9910',
      patientEmail: 'ahmed.hassan@example.com',
      date: '14 May 2026',
      day: '14',
      month: 'May',
      time: '09:00 AM',
      reason: 'Blood pressure review',
      status: 'Confirmed',
      period: 'today',
    },
    {
      id: 2,
      patientName: 'Mariam Ali',
      patientAge: 34,
      patientGender: 'Female',
      patientPhone: '+20 111 683 2047',
      patientEmail: 'mariam.ali@example.com',
      date: '14 May 2026',
      day: '14',
      month: 'May',
      time: '11:30 AM',
      reason: 'ECG assessment',
      status: 'Completed',
      period: 'today',
    },
    {
      id: 3,
      patientName: 'Omar Samir',
      patientAge: 41,
      patientGender: 'Male',
      patientPhone: '+20 122 570 6144',
      patientEmail: 'omar.samir@example.com',
      date: '15 May 2026',
      day: '15',
      month: 'May',
      time: '12:00 PM',
      reason: 'Medication review',
      status: 'Confirmed',
      period: 'upcoming',
    },
    {
      id: 4,
      patientName: 'Nour Adel',
      patientAge: 29,
      patientGender: 'Female',
      patientPhone: '+20 155 218 7781',
      patientEmail: 'nour.adel@example.com',
      date: '16 May 2026',
      day: '16',
      month: 'May',
      time: '02:30 PM',
      reason: 'Diabetes follow-up',
      status: 'Canceled',
      period: 'upcoming',
    },
    {
      id: 5,
      patientName: 'Youssef Kareem',
      patientAge: 56,
      patientGender: 'Male',
      patientPhone: '+20 120 334 8196',
      patientEmail: 'youssef.kareem@example.com',
      date: '17 May 2026',
      day: '17',
      month: 'May',
      time: '10:15 AM',
      reason: 'Post-surgery check',
      status: 'Completed',
      period: 'upcoming',
    },
  ]);

  readonly filteredAppointments = computed(() =>
    this.appointments().filter((appointment) => appointment.status === this.selectedStatus()),
  );

  readonly todayAppointments = computed(() =>
    this.filteredAppointments().filter((appointment) => appointment.period === 'today'),
  );

  readonly upcomingAppointments = computed(() =>
    this.filteredAppointments().filter((appointment) => appointment.period === 'upcoming'),
  );

  readonly statusCounts = computed(() =>
    this.statuses.map((status) => ({
      status,
      count: this.appointments().filter((appointment) => appointment.status === status).length,
    })),
  );

  setStatus(status: AppointmentStatus): void {
    this.selectedStatus.set(status);
  }

  openDetails(appointment: DoctorAppointment): void {
    this.selectedAppointment.set(appointment);
    this.detailsVisible.set(true);
  }

  closeDetails(): void {
    this.detailsVisible.set(false);
  }

  appointmentActions(appointment: DoctorAppointment): MenuItem[] {
    return [
      {
        label: 'More Details',
        icon: 'pi pi-info-circle',
        command: () => this.openDetails(appointment),
      },
      {
        label: 'Cancel',
        icon: 'pi pi-times',
        command: () => {},
      },
    ];
  }

  statusClass(status: AppointmentStatus): string {
    return STATUS_STYLES[status];
  }
}
