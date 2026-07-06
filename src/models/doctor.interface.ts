import { DoctorProfileResponseAPI } from './doctor-api.interface';

export type DoctorCard = Pick<
  DoctorProfileResponseAPI,
  | 'id' | 'gender' | 'specialty' | 'price' | 'rate' | 'picture'
  | 'phone' | 'address' | 'governorate' | 'city' | 'duration'
  | 'email' | 'workingDay'
> & {
  name: string;
};
