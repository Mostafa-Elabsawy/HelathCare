import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { LabService } from '../../../../services/lab.service';
import { FullLabAppointmentAPI } from '../../../../models/lab-appointments.interface';
import { formatDate, formatTime, extractDay, extractMonth, isToday } from '../../../../utils/date-format';

type TestStatus = 'Pending' | 'Approved' | 'Rejected';

interface LabTest {
    id: number;
    patientName: string;
    patientAge: number;
    patientGender: string;
    patientPhone: string;
    patientEmail: string;
    testName: string;
    date: string;
    time: string;
    day: string;
    month: string;
    status: TestStatus;
    period: 'today' | 'upcoming';
    orderedBy: string;
}

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-600',
};

function mapAppointment(a: FullLabAppointmentAPI): LabTest {
    return {
        id: a.id,
        patientName: `${a.firstName} ${a.lastName}`,
        patientAge: 0,
        patientGender: a.gender ?? '',
        patientPhone: a.phone ?? '',
        patientEmail: '',
        testName: a.testName ?? '',
        date: formatDate(a.date),
        time: formatTime(a.date),
        day: extractDay(a.date),
        month: extractMonth(a.date),
        status: (a.status as TestStatus) || 'Pending',
        period: isToday(a.date) ? 'today' : 'upcoming',
        orderedBy: '',
    };
}

@Component({
    selector: 'app-lab-tests',
    imports: [DialogModule, SelectModule, ButtonModule, FormsModule],
    templateUrl: './tests.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabTests {
    private labService = inject(LabService);

    readonly statuses: string[] = ['All', 'Pending', 'Approved', 'Rejected'];
    readonly selectedStatus = signal<string>('All');
    readonly selectedTest = signal<LabTest | null>(null);
    readonly detailsVisible = signal(false);

    readonly tests = computed(() =>
        this.labService.appointments().map(mapAppointment),
    );

    readonly filteredTests = computed(() => {
        const status = this.selectedStatus();
        return status === 'All'
            ? this.tests()
            : this.tests().filter((test) => test.status === status);
    });

    readonly todayTests = computed(() =>
        this.filteredTests().filter((test) => test.period === 'today'),
    );

    readonly upcomingTests = computed(() =>
        this.filteredTests().filter((test) => test.period === 'upcoming'),
    );

    openDetails(test: LabTest): void {
        this.selectedTest.set(test);
        this.detailsVisible.set(true);
    }

    closeDetails(): void {
        this.detailsVisible.set(false);
    }

    statusClass(state: string): string {
        return STATUS_STYLES[state] || 'bg-gray-100 text-gray-600';
    }
}
