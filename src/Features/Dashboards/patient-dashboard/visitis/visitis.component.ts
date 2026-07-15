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
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../../../services/patient.service';
import { PatientAppointmentsAPI, FullPatientLabAppointmentAPI } from '../../../../models/appointment-interface';

interface VisitDisplay {
    id: number;
    type: 'doctor' | 'lab';
    title: string;
    subtitle: string;
    location: string;
    date: string;
    day: string;
    month: string;
    time: string;
    status: string;
    price: number;
    duration: number | null;
}

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Confirmed: 'bg-emerald-100 text-emerald-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-600',
    Rejected: 'bg-red-100 text-red-600',
};

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function parseIsoDate(dateStr: string): Date {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
}

function formatDate(day: number, month: number, year: number): { day: string; month: string; formattedDate: string } {
    const d = day.toString().padStart(2, '0');
    const m = MONTH_NAMES[month] || '---';
    return { day: d, month: m, formattedDate: `${d} ${m} ${year}` };
}

function formatTime12h(time: string): string {
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return time;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function isPast(dateStr: string, type: 'doctor' | 'lab'): boolean {
    const d = type === 'lab' ? parseIsoDate(dateStr) : new Date(dateStr + 'T23:59:59');
    const now = new Date();
    return d < now;
}

@Component({
    selector: 'app-visitis',
    imports: [CommonModule, FormsModule, SelectModule, ButtonModule],
    templateUrl: './visitis.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Visitis {
    private patientService = inject(PatientService);

    selectedStatus = signal<string>('All');
    selectedType = signal<string>('All');
    displayVisits = signal<VisitDisplay[]>([]);

    statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];
    typeOptions = ['All', 'Doctor', 'Lab'];

    filteredVisits = computed(() => {
        let list = this.displayVisits();
        const status = this.selectedStatus();
        if (status !== 'All') {
            list = list.filter((v) => v.status === status);
        }
        const type = this.selectedType();
        if (type !== 'All') {
            list = list.filter((v) => v.type === type.toLowerCase());
        }
        return list.sort((a, b) => {
            const months = MONTH_NAMES;
            const aIdx = months.indexOf(a.month);
            const bIdx = months.indexOf(b.month);
            if (aIdx !== bIdx) return bIdx - aIdx;
            return parseInt(b.day) - parseInt(a.day);
        });
    });

    statusClass(state: string): string {
        return STATUS_STYLES[state] || 'bg-gray-100 text-gray-600';
    }

    private mapDoctorAppointment(a: PatientAppointmentsAPI): VisitDisplay | null {
        if (!a) return null;
        const [y, m, d] = (a.date ?? '').split('-').map(Number);
        if (!y || !m || !d) return null;
        const { day, month, formattedDate } = formatDate(d, m - 1, y);
        return {
            id: a.appointmentId,
            type: 'doctor',
            title: a.doctorName || 'Doctor',
            subtitle: `Appointment`,
            location: [a.city, a.governorate].filter(Boolean).join(', '),
            date: formattedDate,
            day,
            month,
            time: formatTime12h(a.time || ''),
            status: a.state || 'Pending',
            price: a.price ?? 0,
            duration: a.duration ?? null,
        };
    }

    private mapLabAppointment(a: FullPatientLabAppointmentAPI): VisitDisplay | null {
        if (!a) return null;
        const d = parseIsoDate(a.date);
        const { day, month, formattedDate } = formatDate(d.getDate(), d.getMonth(), d.getFullYear());
        return {
            id: a.id,
            type: 'lab',
            title: a.name || 'Lab',
            subtitle: a.testName || 'Lab Test',
            location: [a.city, a.governorate].filter(Boolean).join(', '),
            date: formattedDate,
            day,
            month,
            time: formatTime12h(a.time || ''),
            status: a.status || 'Pending',
            price: a.price ?? 0,
            duration: a.duration ?? null,
        };
    }

    private buildVisits(): VisitDisplay[] {
        const doctorApps = (this.patientService.appointments() || [])
            .filter((a) => isPast(a.date, 'doctor'))
            .map((a) => this.mapDoctorAppointment(a))
            .filter((v): v is VisitDisplay => v !== null);

        const labApps = (this.patientService.labAppointments() || [])
            .filter((a) => isPast(a.date, 'lab'))
            .map((a) => this.mapLabAppointment(a))
            .filter((v): v is VisitDisplay => v !== null);

        return [...doctorApps, ...labApps].sort((a, b) => {
            const months = MONTH_NAMES;
            const aIdx = months.indexOf(a.month);
            const bIdx = months.indexOf(b.month);
            if (aIdx !== bIdx) return bIdx - aIdx;
            return parseInt(b.day) - parseInt(a.day);
        });
    }

    constructor() {
        effect(() => {
            const _ = this.patientService.appointments();
            const __ = this.patientService.labAppointments();
            untracked(() => {
                this.displayVisits.set(this.buildVisits());
            });
        });
    }
}
