import { LabInformationsComponent } from "./Lab-informations/lab-informations.component";

export interface LabInformationsSchema{
  value: {
    email: string;
    phone: string;
    governorate: string;
    city: string;
    address: string;
    name: string;
  };
  valid: boolean;
}
export const defaultLabInformationsData: LabInformationsSchema = {
  value: {
    name: '',
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

export const LabTestCategories = [
  'Hematology',
  'Clinical Chemistry',
  'Microbiology',
  'Immunology',
  'Molecular Diagnostics',
  'Pathology',
  'Parasitology',
  'Hormone Tests',
  'Tumor Markers',
  'Genetic Testing',
  'Toxicology',
  'Blood Bank',
];


