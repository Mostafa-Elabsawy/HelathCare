export interface RegisterDoctorAPI {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  nationalID: string;
  governorate: string;
  city: string;
  address: string;
  specialty: string;
  medicalLevel: string;
}
export interface DoctorProfileResponseAPI { 
  firstName: string;
  lastName: string;
  gender: string;
  nationalID: number;

  specialty: string;
  medicalLevel: string 
  price: number | null;
  rate: number | null;
  picture: string | null;

  phone: string;
  governorate: string;
  city: string;
  address: string;

  workingDay: string[] ;
  workingHourStart: string | null;
  workingHourEnd: string | null;
  duration: number | null;

  appointments: AppointmentAPI[];

  id: number;
  email: string;
  passwordHash: string;
  role: string;
}

export interface AppointmentAPI {
  id: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  day: string;
  month: string;
  time: string;
  reason: string;
  status: 'Confirmed' | 'Completed' | 'Canceled';
  period: 'today' | 'upcoming';
}

export interface UpdateDoctorProfileAPI {
  phone: string;
  specialty: string;
  medicalLevel: string;
  governorate: string;
  city: string;
  address: string;
}

export interface UpdateScheduleAPI {
  workingDay: string[];
  workingHourStart: string;
  workingHourEnd: string;
  duration: number;
  price: number;
}

export const defaultDoctorProfile: DoctorProfileResponseAPI = {
  firstName: '----',
  lastName: '----',
  gender: '----',
  nationalID: 0,
  specialty: '----',
  medicalLevel: '----',
  phone: '----',
  governorate: '----',
  city: '------',
  address: '----',
  workingDay: [],
  workingHourStart: '----',
  workingHourEnd: '----',
  duration: 0,
  appointments: [],
  id: 0,
  email: '------',
  passwordHash: '',
  role: '',
  price: null,
  rate: null,
  picture: null,
}
