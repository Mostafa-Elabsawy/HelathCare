export interface PostNewDoctorAppointment  {
  doctorId: number;
  date: string; // yyyy/mm/dd
  time: string; // hh:mm
    
}

export interface GetPatientAppointments {
  appoinmentId: number;
  date: string; // yyyy/mm/dd
  time: string; // hh:mm
  state: string;
    price: number;
    doctor: {
        duration: number;
        doctorId: number;
        doctorName: string;
        governate: string;
        city: string;
        address: string;
        phone: string;
    }
}
export interface GetDoctorAppointments {
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
