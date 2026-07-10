export interface PostNewDoctorAppointment  {
  doctorId: number;
  date: string; // yyyy/mm/dd
  time: string; // hh:mm
    
}

export interface PatientAppointments {
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
