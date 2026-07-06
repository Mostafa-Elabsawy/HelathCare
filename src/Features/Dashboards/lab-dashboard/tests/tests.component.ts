import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import type { MenuItem } from 'primeng/api';

type TestStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
type TestPeriod = 'today' | 'upcoming';

interface LabTest {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientEmail: string;
  testName: string;
  date: string;
  day: string;
  month: string;
  time: string;
  status: TestStatus;
  period: TestPeriod;
  orderedBy: string;
}

const STATUS_STYLES: Record<TestStatus, string> = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'Cancelled': 'bg-red-100 text-red-600',
};

@Component({
  selector: 'app-lab-tests',
  imports: [DialogModule, SplitButtonModule],
  templateUrl: './tests.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabTests {
  readonly statuses: TestStatus[] = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  readonly selectedStatus = signal<TestStatus>('Pending');
  readonly selectedTest = signal<LabTest | null>(null);
  readonly detailsVisible = signal(false);

  readonly tests = signal<LabTest[]>([
    {
      id: 1,
      patientName: 'Ahmed Hassan',
      patientAge: 48,
      patientGender: 'Male',
      patientPhone: '+20 100 452 9910',
      patientEmail: 'ahmed.hassan@example.com',
      testName: 'Complete Blood Count',
      date: '06 Jul 2026',
      day: '06',
      month: 'Jul',
      time: '09:00 AM',
      status: 'Pending',
      period: 'today',
      orderedBy: 'Dr. Mostafa Ehab',
    },
    {
      id: 2,
      patientName: 'Mariam Ali',
      patientAge: 34,
      patientGender: 'Female',
      patientPhone: '+20 111 683 2047',
      patientEmail: 'mariam.ali@example.com',
      testName: 'Blood Glucose Test',
      date: '06 Jul 2026',
      day: '06',
      month: 'Jul',
      time: '10:30 AM',
      status: 'In Progress',
      period: 'today',
      orderedBy: 'Dr. Sara Khaled',
    },
    {
      id: 3,
      patientName: 'Omar Samir',
      patientAge: 41,
      patientGender: 'Male',
      patientPhone: '+20 122 570 6144',
      patientEmail: 'omar.samir@example.com',
      testName: 'Lipid Profile',
      date: '06 Jul 2026',
      day: '06',
      month: 'Jul',
      time: '11:45 AM',
      status: 'Completed',
      period: 'today',
      orderedBy: 'Dr. Ahmed Nabil',
    },
    {
      id: 4,
      patientName: 'Nour Adel',
      patientAge: 29,
      patientGender: 'Female',
      patientPhone: '+20 155 218 7781',
      patientEmail: 'nour.adel@example.com',
      testName: 'Thyroid Panel',
      date: '07 Jul 2026',
      day: '07',
      month: 'Jul',
      time: '09:00 AM',
      status: 'Pending',
      period: 'upcoming',
      orderedBy: 'Dr. Mostafa Ehab',
    },
    {
      id: 5,
      patientName: 'Youssef Kareem',
      patientAge: 56,
      patientGender: 'Male',
      patientPhone: '+20 120 334 8196',
      patientEmail: 'youssef.kareem@example.com',
      testName: 'Urinalysis',
      date: '07 Jul 2026',
      day: '07',
      month: 'Jul',
      time: '10:15 AM',
      status: 'Cancelled',
      period: 'upcoming',
      orderedBy: 'Dr. Khaled Mahmoud',
    },
    {
      id: 6,
      patientName: 'Laila Ibrahim',
      patientAge: 37,
      patientGender: 'Female',
      patientPhone: '+20 100 123 4567',
      patientEmail: 'laila.ibrahim@example.com',
      testName: 'Vitamin D Test',
      date: '08 Jul 2026',
      day: '08',
      month: 'Jul',
      time: '02:00 PM',
      status: 'Pending',
      period: 'upcoming',
      orderedBy: 'Dr. Sara Khaled',
    },
  ]);

  readonly filteredTests = computed(() =>
    this.tests().filter((test) => test.status === this.selectedStatus()),
  );

  readonly todayTests = computed(() =>
    this.filteredTests().filter((test) => test.period === 'today'),
  );

  readonly upcomingTests = computed(() =>
    this.filteredTests().filter((test) => test.period === 'upcoming'),
  );

  readonly statusCounts = computed(() =>
    this.statuses.map((status) => ({
      status,
      count: this.tests().filter((test) => test.status === status).length,
    })),
  );

  setStatus(status: TestStatus): void {
    this.selectedStatus.set(status);
  }

  openDetails(test: LabTest): void {
    this.selectedTest.set(test);
    this.detailsVisible.set(true);
  }

  closeDetails(): void {
    this.detailsVisible.set(false);
  }

  testActions(test: LabTest): MenuItem[] {
    return [
      {
        label: 'More Details',
        icon: 'pi pi-info-circle',
        command: () => this.openDetails(test),
      },
      {
        label: 'Cancel Test',
        icon: 'pi pi-times',
        command: () => {},
      },
    ];
  }

  statusClass(status: TestStatus): string {
    return STATUS_STYLES[status];
  }
}
