export interface PostNewDoctorAppointment  {
  doctorId: number;
  date: string; // yyyy-mm-dd
  time: string; // hh:mm
}
export interface PostNewLabAppointment  {
  labId: number,
  date: string,// yyyy-mm-dd
  time:string
}

export interface PatientAppointmentsAPI {
  appointmentId: number;
  date: string;
  time: string;
  state: string;
  price: number;
  doctorId: number;
  doctorName: string;
  duration: number;
  governorate: string;
  city: string;
  address: string;
  phone: string;
}

export type getAppointmentState =
  | 'Pending'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';
export interface DoctorAppointmentsAPI {
    appointmentId: number;
    date: string;
    time: string;
    state: string;
    patientId: number;
    name: string;
    phone: string;
    dateBirth: string;
    bloodGroup: string;
    allergies: string[];
    chronic: string[];
    previousSurgery: string[];
    gender: string;
}
import { LabWithIdAPI } from './lab-api.interface';

export interface PatientLabAppointments{
  id: number;
  date: string; // ISO 8601 date (e.g., "2026-07-13T12:00:00")
  patientId: number;
  labId: number;
  status: string;
}
export interface FullPatientLabAppointmentAPI extends PatientLabAppointments, LabWithIdAPI {
  time: string;
  testName: string;
  price: number;
}
