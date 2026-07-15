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
import { DialogModule } from 'primeng/dialog';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../../services/patient.service';
import { FullPatientLabAppointmentAPI } from '../../../../models/appointment-interface';

interface LabAppointmentDisplay extends FullPatientLabAppointmentAPI {
    day: string;
    month: string;
    formattedDate: string;
    formattedTime: string;
    period: 'today' | 'upcoming';
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

function parseIsoDate(dateStr: string): Date {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
}

function formatDate(dateStr: string): { day: string; month: string; formattedDate: string } {
    const d = parseIsoDate(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = MONTH_NAMES[d.getMonth()] || '---';
    const formattedDate = `${day} ${month} ${d.getFullYear()}`;
    return { day, month, formattedDate };
}

function formatTime12h(time: string): string {
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return time;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function isToday(dateStr: string): boolean {
    const d = parseIsoDate(dateStr);
    const today = new Date();
    return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
    );
}

@Component({
    selector: 'app-lab-appointments',
    imports: [FormsModule, SelectModule, ButtonModule, DialogModule, RouterLink],
    templateUrl: './lab-appointments.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabAppointments {
    private patientService = inject(PatientService);

    selectedStatus = signal<string>('All');
    selectedAppointment = signal<LabAppointmentDisplay | null>(null);
    detailsVisible = signal(false);
    displayAppointments = signal<LabAppointmentDisplay[]>([]);

    statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

    filteredAppointments = computed(() => {
        const status = this.selectedStatus();
        return status === 'All'
            ? this.displayAppointments()
            : this.displayAppointments().filter((a) => a.status === status);
    });

    todayAppointments = computed(() =>
        this.filteredAppointments().filter((a) => a.period === 'today'),
    );

    upcomingAppointments = computed(() =>
        this.filteredAppointments().filter((a) => a.period === 'upcoming'),
    );

    statusClass(state: string): string {
        return STATUS_STYLES[state] || 'bg-gray-100 text-gray-600';
    }

    openDetails(appointment: LabAppointmentDisplay): void {
        this.selectedAppointment.set(appointment);
        this.detailsVisible.set(true);
    }

    closeDetails(): void {
        this.detailsVisible.set(false);
    }

    private formatAppointments(ap: FullPatientLabAppointmentAPI[]): LabAppointmentDisplay[] {
        return ap.map((a) => {
            const { day, month, formattedDate } = formatDate(a.date);
            return {
                ...a,
                day,
                month,
                formattedDate,
                formattedTime: formatTime12h(a.time),
                period: isToday(a.date) ? 'today' : 'upcoming',
            };
        });
    }

    constructor() {
        effect(() => {
            const appointments = this.patientService.labAppointments();
            untracked(() => {
                this.displayAppointments.set(this.formatAppointments(appointments));
            });
        });
    }
}
