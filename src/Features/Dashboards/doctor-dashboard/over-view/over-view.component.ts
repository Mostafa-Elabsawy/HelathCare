import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../../services/doctor.service';
import { RouterLink } from "@angular/router";

interface PatientRequest {
    id: number;
    name: string;
    phone: string;
    date: string;
    time: string;
    status: string;
}

interface TodayAppointment {
    id: number;
    name: string;
    day: string;
    month: string;
    date: string;
    time: string;
    state: string;
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Approved: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-600',
    Cancelled: 'bg-red-100 text-red-600',
    Completed: 'bg-blue-100 text-blue-700',
};

function formatDate(dateStr: string): { day: string; month: string; formattedDate: string } {
    const [y, m, d] = dateStr.split('-').map(Number);
    return {
        day: d.toString().padStart(2, '0'),
        month: MONTH_NAMES[m - 1] || '---',
        formattedDate: `${d} ${MONTH_NAMES[m - 1] || '---'} ${y}`,
    };
}

function isPast(dateStr: string): boolean {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

function resolveState(state: string, date: string): string {
    if ((state === 'Accepted' || state === 'Approved') && isPast(date)) return 'Completed';
    return state;
}

function formatTime12h(time: string): string {
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return time;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

@Component({
    selector: 'app-doctor-dashboard-overview',
    imports: [CommonModule, RouterLink],
    templateUrl: './over-view.component.html',
})
export class DoctorOverview {
    doctorService = inject(DoctorService);

    doctorName = signal('Doctor');
    totalAppointments = signal(0);
    todayAppointments = signal(0);
    avgRating = computed(() => {
        const rate = this.doctorService.doctor().rate;
        return rate ? `${rate}/5` : '0';
    });
    revenue = computed(() => {
        const price = this.doctorService.doctor().price;
        if (!price) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.doctorService.appointments().filter((a) => a.state === 'Approved').length * price;
    });

    patientRequests = signal<PatientRequest[]>([]);
    todayAppointmentList = signal<TodayAppointment[]>([]);

    pendingCount = computed(() => this.patientRequests().length);

    statusClass(state: string): string {
        return STATUS_STYLES[state] || 'bg-gray-100 text-gray-600';
    }

    acceptRequest(id: number) {
        this.doctorService.acceptAppointment(id).subscribe();
    }

    declineRequest(id: number) {
        this.doctorService.rejectAppointment(id).subscribe();
    }

    constructor() {
        this.doctorService.loadAppointments();
        effect(() => {
            const profile = this.doctorService.doctor();
            untracked(() => {
                if (profile.firstName !== '-------') {
                    this.doctorName.set(`Dr. ${profile.firstName}`);
                }
            });
        });

        effect(() => {
            const appointments = this.doctorService.appointments();
            untracked(() => {
                this.totalAppointments.set(appointments.length);
                const today = new Date().toISOString().split('T')[0];
                const todays = appointments.filter((a) => a.date === today);
                this.todayAppointments.set(todays.length);
                this.todayAppointmentList.set(
                    todays.map((a) => {
                        const { day, month, formattedDate } = formatDate(a.date);
                        return {
                            id: a.appointmentId,
                            name: a.name,
                            day,
                            month,
                            date: formattedDate,
                            time: formatTime12h(a.time),
                            state: resolveState(a.state, a.date),
                        };
                    }),
                );

                const requests: PatientRequest[] = appointments
                    .filter((a) => resolveState(a.state, a.date) === 'Pending')
                    .slice(0, 6)
                    .map((a) => ({
                        id: a.appointmentId,
                        name: a.name,
                        phone: a.phone,
                        date: a.date,
                        time: a.time,
                        status: a.state,
                    }));
                this.patientRequests.set(requests);
            });
        });
    }
}
