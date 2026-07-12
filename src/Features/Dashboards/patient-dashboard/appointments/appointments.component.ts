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
import { PatientAppointmentsAPI } from '../../../../models/appointment-interface';

interface PatientAppointmentDisplay extends PatientAppointmentsAPI {
    day: string;
    month: string;
    period: 'today' | 'upcoming';
}

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Confirmed: 'bg-emerald-100 text-emerald-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-600',
};

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

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

function isToday(dateStr: string): boolean {
    const [y, m, d] = dateStr.split('-').map(Number);
    const today = new Date();
    return y === today.getFullYear() && m === today.getMonth() + 1 && d === today.getDate();
}

@Component({
    selector: 'app-appointments',
    imports: [FormsModule, SelectModule, ButtonModule, DialogModule, RouterLink],
    templateUrl: './appointments.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Appointments {
    private patientService = inject(PatientService);

    selectedStatus = signal<string>('All');
    selectedAppointment = signal<PatientAppointmentDisplay | null>(null);
    detailsVisible = signal(false);
    displayAppointments = signal<PatientAppointmentDisplay[]>([]);

    statusOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

    filteredAppointments = computed(() => {
        const status = this.selectedStatus();
        return status === 'All'
            ? this.displayAppointments()
            : this.displayAppointments().filter((a) => a.state === status);
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

    openDetails(appointment: PatientAppointmentDisplay): void {
        this.selectedAppointment.set(appointment);
        this.detailsVisible.set(true);
    }

    closeDetails(): void {
        this.detailsVisible.set(false);
    }

    private formatAppointments(ap: PatientAppointmentsAPI[]): PatientAppointmentDisplay[] {
        return ap.map((a) => {
            const { day, month, formattedDate } = formatDate(a.date);
            return {
                ...a,
                day,
                month,
                date: formattedDate,
                time: formatTime12h(a.time),
                period: isToday(a.date) ? 'today' : 'upcoming',
            };
        });
    }

    constructor() {
        effect(() => {
            const appointments = this.patientService.appointments();
            untracked(() => {
                this.displayAppointments.set(this.formatAppointments(appointments));
            });
        });
    }
}
