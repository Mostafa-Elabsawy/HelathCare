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
import { LabService } from '../../../../services/lab.service';
import { FullLabAppointmentAPI } from '../../../../models/lab-appointments.interface';
import { formatDate, formatTime, extractDay, extractMonth } from '../../../../utils/date-format';

interface VisitDisplay {
    id: number;
    patientName: string;
    patientPhone: string;
    patientGender: string;
    testName: string;
    date: string;
    day: string;
    month: string;
    time: string;
    status: string;
}

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-600',
};

function isPastIso(iso: string): boolean {
    const d = new Date(iso);
    const now = new Date();
    return d < now;
}

@Component({
    selector: 'app-lab-visits',
    imports: [CommonModule, FormsModule, SelectModule],
    templateUrl: './visits.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabVisits {
    private labService = inject(LabService);

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

    private mapVisit(a: FullLabAppointmentAPI): VisitDisplay | null {
        if (!a) return null;
        return {
            id: a.id,
            patientName: `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || 'Unknown',
            patientPhone: a.phone || '---',
            patientGender: a.gender || '',
            testName: a.testName || 'Lab Test',
            date: formatDate(a.date),
            day: extractDay(a.date),
            month: extractMonth(a.date),
            time: formatTime(a.date),
            status: a.status || 'Pending',
        };
    }

    private buildVisits(): VisitDisplay[] {
        return (this.labService.appointments() || [])
            .filter((a) => isPastIso(a.date))
            .map((a) => this.mapVisit(a))
            .filter((v): v is VisitDisplay => v !== null)
            .sort((a, b) => {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const aIdx = months.indexOf(a.month);
                const bIdx = months.indexOf(b.month);
                if (aIdx !== bIdx) return bIdx - aIdx;
                return parseInt(b.day) - parseInt(a.day);
            });
    }

    constructor() {
        effect(() => {
            const _ = this.labService.appointments();
            untracked(() => {
                this.displayVisits.set(this.buildVisits());
            });
        });
    }
}
