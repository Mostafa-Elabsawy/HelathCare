export interface LabRegisterAPI {
    email: string;
    password: string;
    name: string;
    phone: string;
    governorate: string;
    city: string;
    address: string;
}
export interface LabProfile {
    id: number;
    name: string;
    email: string;
    phone: string;

    workingDays: string[] | null;
    workingHourStart: string | null;
    workingHourEnd: string | null;
    duration: number | null;

    governorate: string;
    city: string;
    address: string;

    tests: LabTest[];
    labBookings: [];
    labResults: [];

    passwordHash: string;
    role: string;
}
export interface UpdatedLab extends LabProfile {}
export interface LabTest {
    testName: string;
    price: number;
    testDetails: string;
}
export interface UpdateLabTestAPI {
    tests: LabTest[];
}
