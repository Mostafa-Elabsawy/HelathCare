// Personal Information Schema
export interface PersonalDataSchema {
  value: {
    firstName: string;
    lastName: string;
    gender: string;
    nationalID: string;
    specialty: string;
    medicalLevel: string;
  };
  valid: boolean;
}
export const defaultPersonalData: PersonalDataSchema = {
  value: {
    firstName: '',
    lastName: '',
    gender: '',
    nationalID: '',
    specialty: '',
    medicalLevel: '',
  },
  valid: false,
};
//Contact Information Schema
export interface ContatactDataSchema {
  value: {
    email: string;
    phone: string;
    governorate: string;
    city: string;
    address: string;
  };
  valid: boolean;
}
export const defaultContactData: ContatactDataSchema = {
  value: {
    email: '',
    phone: '',
    governorate: '',
    city: '',
    address: '',
  },
  valid: false,
};
export interface GOV {
  id: number;
  code: string;
  name: string;
  nameEn: string;
}
export const default_GOV: GOV = { id: 0, code: '', name: '', nameEn: '' };
export interface CTY {
  id: number;
  governorateCode: string;
  name: string;
  nameEn: string;
}
export const default_CTY: CTY = { id: 0, governorateCode: '', name: '', nameEn: '' };

//Professional Information Schema

//Security Information Schema
export interface SecurityDataSchema {
  value: {
    password: string;
    confirmPassword: string;
    checkBox: boolean;
  };
  valid: boolean;
}
export const defaultSecurityData: SecurityDataSchema = {
  value: {
    password: '',
    confirmPassword: '',
    checkBox: false,
  },
  valid: false,
};
export const DoctorSpecialties = [
  'General Medicine',
  'Internal Medicine',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology & Obstetrics',
  'Ophthalmology',
  'ENT (Ear, Nose, Throat)',
  'Psychiatry',
  'Dentistry',
  'Endocrinology',
  'Gastroenterology',
  'Pulmonology',
  'Nephrology',
  'Urology',
  'Oncology',
  'Rheumatology',
  'Radiology',
  'Anesthesiology',
  'General Surgery',
  'Vascular Surgery',
  'Plastic Surgery',
  'Neurosurgery',
  'Emergency Medicine',
  'Family Medicine',
  'Sports Medicine',
  'Pathology',
  'Allergy & Immunology',
];


