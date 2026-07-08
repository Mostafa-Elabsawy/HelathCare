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
export interface DoctorAppointments {
  appoinmentId: number;
  date: string; // yyyy/mm/dd
  time: string; // hh:mm
  state: string;

  patient: {
    PatientId: number;
    name: string;
    phone: string;
    dateBirth: string;
    bloodGroup: string;
    allergies: string[];
    chronic: string[];
    previousSurgery: string[];
    gender: string;
  };
}
