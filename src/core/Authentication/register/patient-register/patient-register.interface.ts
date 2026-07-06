export interface PersonalDataSchema {
  value: {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationalID: string;
  };
  valid: boolean;
}
export const defaultPersonalData: PersonalDataSchema = {
  value: {
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationalID: '',
  },
  valid: false,
};
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
export const Insurace_providers = [
  { label: 'UHIA', value: 'UHIA' },
  { label: 'HIO', value: 'HIO' },
  { label: 'Doctors Syndicate', value: 'Doctors Syndicate' },
  { label: 'Engineers Syndicate', value: 'Engineers Syndicate' },
  { label: 'GlobeMed Egypt', value: 'GlobeMed Egypt' },
  { label: 'AXA Egypt', value: 'AXA Egypt' },
];
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
export interface MedicalDataSchema {
  value: {
    
    allergies: string[];
    chronic: string[];
    previousSurgery: string[];
    bloodGroup: string;
    hasInsurance: string;
  };
  valid: boolean;
};
export const defaultMeicalData: MedicalDataSchema = {
  value: { 
    allergies: [],
    chronic: [],
    previousSurgery: [],
    bloodGroup: '',
    hasInsurance: '',
  },
  valid:true
};
export interface SecurityDataSchema{
  value: {
    password: string;
    confirmPassword: string;
    checkBox: boolean
  };
  valid: boolean;
}
export const defaultSecurityData: SecurityDataSchema = {
  value: {
    password: '',
    confirmPassword: '',
    checkBox: false
  },
  valid: false,
};