export interface LabAppointmentsAPI{
  id: number;
  date: string; 
  patientId: number;
  labId: number;
  status: string;
  testName?: string;
}
export interface PatientWithIdAPI{
  firstName: string; 
  lastName: string; 
  gender:string;
  phone: string;
}
export interface FullLabAppointmentAPI
  extends LabAppointmentsAPI, PatientWithIdAPI {}