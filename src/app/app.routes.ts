import { Routes } from '@angular/router';
import { PatientRegister } from '../core/Authentication/register/patient-register/main/patient-register.component';
import { PatientDashboard } from '../Features/Dashboards/patient-dashboard/main/patient-dashboard.component';
import { LabResults } from '../Features/Dashboards/patient-dashboard/lab-results/lab-results.component';
import { PatientInfo } from '../Features/Dashboards/patient-dashboard/patient-info/patient-info.component';
import { Visitis } from '../Features/Dashboards/patient-dashboard/visitis/visitis.component';
import { Login } from '../core/Authentication/login/login.component';
import { Home } from '../Features/home/main/home.component';
import { Appointments } from '../Features/Dashboards/patient-dashboard/appointments/appointments.component';
import { LabAppointments } from '../Features/Dashboards/patient-dashboard/lab-appointments/lab-appointments.component';
import { DoctorRegister } from '../core/Authentication/register/doctor-register/main/doctor-register.component';
import { LabRegister } from '../core/Authentication/register/lab-register/main/lab-register.component';
import { ExploreComponent } from '../Features/patient-hub/explore/explore.component';
import { BookAppointmentComponent } from '../Features/patient-hub/book-appointment/book-appointment.component';
import { CheckoutComponent } from '../Features/patient-hub/book-appointment/checkout/checkout.component';
import { DoctorDashboard } from '../Features/Dashboards/doctor-dashboard/main/doctor-dashboard.component';
import { DoctorOverview } from '../Features/Dashboards/doctor-dashboard/over-view/over-view.component';
import { DoctorAppointments } from '../Features/Dashboards/doctor-dashboard/appointments/appointments.component';
import { DoctorVisits } from '../Features/Dashboards/doctor-dashboard/visits/visits.component';
import { DoctorSchedule } from '../Features/Dashboards/doctor-dashboard/schedule/schedule.component';
import { DoctorNotifications } from '../Features/Dashboards/doctor-dashboard/notifications/notifications.component';
import { DoctorReports } from '../Features/Dashboards/doctor-dashboard/reports/reports.component';
import { DoctorProfileComponent } from '../Features/Dashboards/doctor-dashboard/profile/profile.component';
import { RegisterType } from '../Features/home/register-type/register-type.component';
import { DashboardsComponent } from '../Features/Dashboards/main/dashboards.component';
import { NotFoundComponent } from '../Features/not-found/not-found.component';
import { SpinnerComponent } from '../Features/spinner/spinner.component';
import { UnauthorizedComponent } from '../Features/unauthorized/unauthorized.component';
import { LabDashboard } from '../Features/Dashboards/lab-dashboard/main/lab-dashboard.component';
import { LabDashboardOverview } from '../Features/Dashboards/lab-dashboard/dashboard/dashboard.component';
import { LabTests } from '../Features/Dashboards/lab-dashboard/tests/tests.component';
import { LabVisits } from '../Features/Dashboards/lab-dashboard/visits/visits.component';
import { LabUpload } from '../Features/Dashboards/lab-dashboard/upload/upload.component';

import { LabProfile } from '../Features/Dashboards/lab-dashboard/profile/profile.component';
import { LabSchedule } from '../Features/Dashboards/lab-dashboard/schedule/schedule.component';
import { TestCatalog } from '../Features/Dashboards/lab-dashboard/test-catalog/test-catalog.component';
import { PatientHubComponent } from '../Features/patient-hub/main/patient-hub.component';
import { BookLabTestComponent } from '../Features/patient-hub/book-lab-test/book-lab-test.component';
import { LabCheckoutComponent } from '../Features/patient-hub/book-lab-test/lab-checkout/lab-checkout.component';
import { AiLabAnalysisComponent } from '../Features/patient-hub/ai-lab-analysis/ai-lab-analysis.component';
export const routes: Routes = [
    //redirect to home if path is empty
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },

    //home page
    {
        path: 'home',
        component: Home,
    },

    //register page
    {
        path: 'register',
        children: [
            {
                path: '',
                redirectTo: 'roles',
                pathMatch: 'full',
            },
            {
                path: 'roles',
                component: RegisterType,
            },
            {
                path: 'patient',
                component: PatientRegister,
            },
            {
                path: 'doctor',
                component: DoctorRegister,
            },
            {
                path: 'laboratory',
                component: LabRegister,
            },
            {
                path: 'lab',
                component: LabRegister,
            },
        ],
    },

    //login page
    {
        path: 'login',
        component: Login,
    },

    //dashboard page
    {
        path: 'dashboard',
        component: DashboardsComponent,
        children: [
            {
                path: 'doctor',
                component: DoctorDashboard,
                children: [
                    { path: '', redirectTo: 'overview', pathMatch: 'full' },
                    { path: 'overview', component: DoctorOverview },
                    { path: 'appointments', component: DoctorAppointments },
                    { path: 'visits', component: DoctorVisits },
                    { path: 'schedule', component: DoctorSchedule },
                    { path: 'Notifications', component: DoctorNotifications },
                    { path: 'Reports', component: DoctorReports },
                    { path: 'profile', component: DoctorProfileComponent },
                ],
            },
            {
                path: 'patient',
                component: PatientDashboard,
                children: [
                    { path: '', redirectTo: 'Patient-Info', pathMatch: 'full' },
                    {
                        path: 'Patient-Info',
                        component: PatientInfo,
                    },
                    {
                        path: 'Lab-Results',
                        component: LabResults,
                    },
                    {
                        path: 'Appointments',
                        component: Appointments,
                    },
                    {
                        path: 'Lab-Appointments',
                        component: LabAppointments,
                    },
                    {
                        path: 'Visits',
                        component: Visitis,
                    },
                    {
                        path: 'Appointments',
                        component: Appointments,
                    },
                ],
            },
            {
                path: 'lab',
                component: LabDashboard,
                children: [
                    { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
                    { path: 'Dashboard', component: LabDashboardOverview },
                    { path: 'Tests', component: LabTests },
                    { path: 'Visits', component: LabVisits },
                    { path: 'Schedule', component: LabSchedule },
                    { path: 'TestCatalog', component: TestCatalog },
                    { path: 'Upload', component: LabUpload },

                    { path: 'Profile', component: LabProfile },
                ],
            },
        ],
    },

    // browse services page
    {
        path: 'patient-hub',
        component: PatientHubComponent,
        children: [
            {
                path: '',
                redirectTo: 'explore',
                pathMatch: 'full',
            },
            {
                path: 'explore',
                component: ExploreComponent,
            },
            {
                path: 'book-appointment',
                component: BookAppointmentComponent,
            },
            {
                path: 'book-appointment/:id',
                component: CheckoutComponent,
            },
            {
                path: 'book-lab-test',
                component: BookLabTestComponent,
            },
            {
                path: 'book-lab-test/:id',
                component: LabCheckoutComponent,
            },
            {
                path: 'ai-lab-analysis',
                component: AiLabAnalysisComponent,
            },
        ],
    },

    {
        path: 'unauthorized',
        component: UnauthorizedComponent,
    },
    {
        path: '**',
        component: NotFoundComponent,
    },
];
