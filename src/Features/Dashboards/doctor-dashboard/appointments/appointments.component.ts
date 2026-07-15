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
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectModule } from 'primeng/select';
import type { MenuItem } from 'primeng/api';
import { DoctorService } from '../../../../services/doctor.service';
import { DoctorAppointmentsAPI } from '../../../../models/appointment-interface';
import { Button } from "primeng/button";

interface DoctorAppointmentDisplay extends DoctorAppointmentsAPI {
    day: string;
    month: string;
    reason: string;
    patientAge: number;
    period: 'today' | 'upcoming';
}

interface StatusOption {
    label: string;
    value: string;
}

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-600',
};

function calcAge(dateBirth: string): number {
    if (!dateBirth) return 0;
    const [y, m, d] = dateBirth.split(/[/-]/).map(Number);
    if (!y || !m) return 0;
    const birth = new Date(y, m - 1, d || 1);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / 31557600000);
}

const MONTH_NAMES = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
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

function isPast(dateStr: string): boolean {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

@Component({
    selector: 'app-doctor-appointments',
    imports: [FormsModule, DialogModule, SplitButtonModule, SelectModule, Button],
    templateUrl: './appointments.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorAppointments {
    private doctorService = inject(DoctorService);

    selectedStatus = signal<string>('All');
    selectedAppointment = signal<DoctorAppointmentDisplay | null>(null);
    detailsVisible = signal(false);

    displayAppointments = signal<DoctorAppointmentDisplay[]>([]);

    statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

    filteredAppointments = computed(() => {
        const status = this.selectedStatus();
        return status === 'All'
            ? this.displayAppointments()
            : this.displayAppointments().filter((a) => a.state === status);
    });

    todayAppointments = computed(() =>
        this.filteredAppointments().filter((a) => a.period === 'today' ),
    );

    upcomingAppointments = computed(() =>
        this.filteredAppointments().filter((a) => a.period === 'upcoming' ),
    );

    openDetails(appointment: DoctorAppointmentDisplay): void {
        this.selectedAppointment.set(appointment);
        this.detailsVisible.set(true);
    }

    closeDetails(): void {
        this.detailsVisible.set(false);
    }

    statusClass(state: string): string {
        return STATUS_STYLES[state] || 'bg-gray-100 text-gray-600';
    }
    formatAppoinments(ap: DoctorAppointmentsAPI[]): DoctorAppointmentDisplay[] {
        let formattedAppointments: DoctorAppointmentDisplay[] = ap.map(
            (a: DoctorAppointmentsAPI) => {
                const { day, month } = formatDate(a.date);
                let state = a.state;
                if ((state === 'Accepted' || state === 'Approved') && isPast(a.date)) {
                    state = 'Completed';
                }
                return {
                    ...a,
                    patientAge: 5,
                    day,
                    month,
                    date: formatDate(a.date).formattedDate,
                    time: formatTime12h(a.time),
                    reason: '',
                    period: isToday(a.date) ? 'today' : 'upcoming',
                    state,
                };
            },
        );
        return formattedAppointments;
    }
    constructor() {
        this.doctorService.loadAppointments();
        effect(() => {
            let current_appointments = this.doctorService.appointments();
            untracked(() => {
                if (current_appointments.length < 0) return;
                this.displayAppointments.set(this.formatAppoinments(current_appointments));
            });
        });
    }
}
