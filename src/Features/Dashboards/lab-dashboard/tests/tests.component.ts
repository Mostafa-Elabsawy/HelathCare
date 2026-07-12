import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

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

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-600',
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const TEST_TYPES = [
    { label: 'Complete Blood Count (CBC)', value: 'Complete Blood Count' },
    { label: 'Blood Glucose Test', value: 'Blood Glucose Test' },
    { label: 'Lipid Profile', value: 'Lipid Profile' },
    { label: 'Thyroid Panel', value: 'Thyroid Panel' },
    { label: 'Urinalysis', value: 'Urinalysis' },
    { label: 'Vitamin D Test', value: 'Vitamin D Test' },
    { label: 'Liver Function Test', value: 'Liver Function Test' },
    { label: 'Kidney Function Test', value: 'Kidney Function Test' },
    { label: 'HbA1c', value: 'HbA1c' },
    { label: 'Iron Studies', value: 'Iron Studies' },
];

@Component({
    selector: 'app-lab-tests',
    imports: [FormsModule, DialogModule, SelectModule, ButtonModule, InputTextModule, InputNumberModule],
    templateUrl: './tests.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabTests {
    readonly statuses: string[] = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];
    readonly selectedStatus = signal<string>('All');
    readonly selectedTest = signal<LabTest | null>(null);
    readonly detailsVisible = signal(false);
    readonly newTestDialogVisible = signal(false);

    readonly testTypes = TEST_TYPES;

    // New test form model
    newTest = {
        patientName: '',
        patientAge: 0,
        patientGender: 'Male',
        patientPhone: '',
        patientEmail: '',
        testName: '',
        orderedBy: '',
        date: '',
        time: '',
    };

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

    openNewTestDialog(): void {
        this.newTest = {
            patientName: '',
            patientAge: 0,
            patientGender: 'Male',
            patientPhone: '',
            patientEmail: '',
            testName: '',
            orderedBy: '',
            date: new Date().toISOString().slice(0, 10),
            time: '09:00',
        };
        this.newTestDialogVisible.set(true);
    }

    addTest(): void {
        const today = new Date();
        const dateObj = this.newTest.date ? new Date(this.newTest.date) : today;
        const day = dateObj.getDate().toString().padStart(2, '0');
        const month = MONTH_NAMES[dateObj.getMonth()];
        const formattedDate = `${day} ${month} ${dateObj.getFullYear()}`;
        const [h, m] = (this.newTest.time || '09:00').split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        const time = `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        const isToday =
            dateObj.getFullYear() === today.getFullYear() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getDate() === today.getDate();

        const newTest: LabTest = {
            id: Date.now(),
            patientName: this.newTest.patientName,
            patientAge: this.newTest.patientAge,
            patientGender: this.newTest.patientGender,
            patientPhone: this.newTest.patientPhone,
            patientEmail: this.newTest.patientEmail,
            testName: this.newTest.testName,
            date: formattedDate,
            day,
            month,
            time,
            status: 'Pending',
            period: isToday ? 'today' : 'upcoming',
            orderedBy: this.newTest.orderedBy || 'Walk-in Patient',
        };

        this.tests.update((list) => [newTest, ...list]);
        this.newTestDialogVisible.set(false);
    }

    statusClass(state: string): string {
        return STATUS_STYLES[state] || 'bg-gray-100 text-gray-600';
    }
}
