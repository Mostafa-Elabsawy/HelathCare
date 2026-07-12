export interface WorkingDay {
    label: string;
    value: string;
    enabled: boolean;
}

export interface ScheduleSettings {
    startHour: string;
    endHour: string;
    duration: number;
    price: number;
    workingDays: string[];
}

export interface SelectOption<T> {
    label: string;
    value: T;
}

export const INITIAL_SCHEDULE: ScheduleSettings = {
    startHour: '09:00',
    endHour: '17:00',
    duration: 30,
    price: 300,
    workingDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
};

export const Hours: SelectOption<string>[] = [
    { label: '06:00 AM', value: '06:00' },
    { label: '07:00 AM', value: '07:00' },
    { label: '08:00 AM', value: '08:00' },
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '01:00 PM', value: '13:00' },
    { label: '02:00 PM', value: '14:00' },
    { label: '03:00 PM', value: '15:00' },
    { label: '04:00 PM', value: '16:00' },
    { label: '05:00 PM', value: '17:00' },
    { label: '06:00 PM', value: '18:00' },
    { label: '07:00 PM', value: '19:00' },
    { label: '08:00 PM', value: '20:00' },
    { label: '09:00 PM', value: '21:00' },
    { label: '10:00 PM', value: '22:00' },
];
