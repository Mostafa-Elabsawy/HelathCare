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

  bloodGroup: string ;

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
  id: 0,
  nationalID: 0,

  firstName: '-----',
  middleName: '-----',
  lastName: '-----',

  phone: '---------',
  email: '-----@-----.----',

  gender: 'male' ,

  dateOfBirth: '',

  bloodGroup: '----',

  chronic: ['-----'],
  previousSurgery: [ '------'],
  allergies: ['-------'],
  picture: ' placeholder1.jpg',

  governorate: '-----',
  address: '--------',

  hasInsurance: '------',

  appointments: [],
  hospitalBookings: [],
  labBookings: [],

  passwordHash: 'hashed_password_here',

  role: 'Patient',
};
export class LabResult {
  id!: number;
  pdfUrl!: string;
  uploadedAt!: string;
  testName?: string;

  get link(): string {
    return `https://healthsystem.runasp.net${this.pdfUrl}`;
  }
}
export interface LabResultDisplay {
  title: string;
  date: string;
  link: string;
}
