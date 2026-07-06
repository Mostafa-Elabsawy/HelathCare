export interface RegisterPatientAPI {
  nationalID: string;
  email: string;
  password: string;
  phone: string;
  firstName: string
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  chronic: string[];
  previousSurgery: string[];
  allergies: string[];
  governorate: string;
  address: string;
  hasInsurance: string;
}
export interface UpdatePatientProfileAPI {
  phone: string;
  governorate: string;
  address: string;
  allergies: string[];
  chronic: string[];
  previousSurgery: string[];
  bloodGroup: string;
  hasInsurance: string;
  gender: string;
  dateOfBirth: string; // ISO date string
}
export interface PatientProfileResponseAPI {
  id: number;
  nationalID: number;

  firstName: string;
  middleName: string;
  lastName: string;

  phone: string;
  email: string;

  gender: 'male' | 'female';

  dateOfBirth: string; 

  bloodGroup: string;

  chronic: string[];
  previousSurgery: string[];
  allergies: string[];

  picture: string | null;

  governorate: string;
  address: string;

  hasInsurance: string; // you may later make it enum if fixed (e.g. 'HIO' | 'None')

  appointments: unknown[];      // replace with real types later
  hospitalBookings: unknown[];
  labBookings: unknown[];
  
  passwordHash: string;
  role: 'Patient' | 'Doctor' | 'Admin'; // extend if needed
}
export const defaultPatientProfil: PatientProfileResponseAPI = {
  id: 1,
  nationalID: 29801011501234,

  firstName: 'Ahmed',
  middleName: 'Mohamed',
  lastName: 'Hassan',

  phone: '+201001234567',
  email: 'ahmed.hassan@example.com',

  gender: 'male' as const,

  dateOfBirth: '1998-01-15',

  bloodGroup: 'A+',

  chronic: ['Diabetes', 'Hypertension'],
  previousSurgery: ['Appendectomy', 'Knee Arthroscopy'],
  allergies: ['Penicillin', 'Peanuts'],

  picture: 'https://randomuser.me/api/portraits/men/1.jpg',

  governorate: 'Menoufia',
  address: '24 Maki St., Shebin El-Kom, Menoufia, Egypt',

  hasInsurance: 'HIO',

  appointments: [],
  hospitalBookings: [],
  labBookings: [],

  passwordHash: 'hashed_password_here',

  role: 'Patient',
};