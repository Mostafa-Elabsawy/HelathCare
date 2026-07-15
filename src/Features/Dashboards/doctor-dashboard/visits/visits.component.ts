import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal,
    untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../../services/doctor.service';
import { DoctorAppointmentsAPI } from '../../../../models/appointment-interface';

interface VisitDisplay {
    id: number;
    patientName: string;
    patientPhone: string;
    patientGender: string;
    bloodGroup: string;
    age: number;
    date: string;
    day: string;
    month: string;
    time: string;
    status: string;
}

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-600',
};

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function calcAge(dateBirth: string): number {
    if (!dateBirth) return 0;
    const [y, m, d] = dateBirth.split(/[/-]/).map(Number);
    if (!y || !m) return 0;
    const birth = new Date(y, m - 1, d || 1);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / 31557600000);
}

function formatDate(dateStr: string): { day: string; month: string; formattedDate: string } {
    const [y, m, d] = dateStr.split('-').map(Number);
    return {
        day: d.toString().padStart(2, '0'),
        month: MONTH_NAMES[m - 1] || '---',
        formattedDate: `${d} ${MONTH_NAMES[m - 1] || '---'} ${y}`,
    };
}

function formatTime12h(time: string): string {
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return time;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function isPast(dateStr: string): boolean {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

@Component({
    selector: 'app-doctor-visits',
    imports: [CommonModule, FormsModule, SelectModule],
    templateUrl: './visits.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorVisits {
    private doctorService = inject(DoctorService);

    selectedStatus = signal<string>('All');
    displayVisits = signal<VisitDisplay[]>([]);

    statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

    filteredVisits = computed(() => {
        const status = this.selectedStatus();
        return status === 'All'
            ? this.displayVisits()
            : this.displayVisits().filter((v) => v.status === status);
    });

    statusClass(state: string): string {
        return STATUS_STYLES[state] || 'bg-gray-100 text-gray-600';
    }

    private mapVisit(a: DoctorAppointmentsAPI): VisitDisplay | null {
        if (!a) return null;
        const { day, month, formattedDate } = formatDate(a.date);
        let status = a.state;
        if ((status === 'Accepted' || status === 'Approved') && isPast(a.date)) {
            status = 'Completed';
        }
        return {
            id: a.appointmentId,
            patientName: a.name || 'Unknown',
            patientPhone: a.phone || '---',
            patientGender: a.gender || '',
            bloodGroup: a.bloodGroup || '---',
            age: calcAge(a.dateBirth),
            date: formattedDate,
            day,
            month,
            time: formatTime12h(a.time),
            status,
        };
    }

    private buildVisits(): VisitDisplay[] {
        return (this.doctorService.appointments() || [])
            .filter((a) => isPast(a.date))
            .map((a) => this.mapVisit(a))
            .filter((v): v is VisitDisplay => v !== null)
            .sort((a, b) => {
                const aIdx = MONTH_NAMES.indexOf(a.month);
                const bIdx = MONTH_NAMES.indexOf(b.month);
                if (aIdx !== bIdx) return bIdx - aIdx;
                return parseInt(b.day) - parseInt(a.day);
            });
    }

    constructor() {
        effect(() => {
            const _ = this.doctorService.appointments();
            untracked(() => {
                this.displayVisits.set(this.buildVisits());
            });
        });
    }
}
