import { Routes } from '@angular/router';
import { PatientRegister } from '../core/Authentication/register/patient-register/main/patient-register.component';
import { PatientDashboard } from '../Features/Dashboards/patient-dashboard/main/patient-dashboard.component';
import { LabResults } from '../Features/Dashboards/patient-dashboard/lab-results/lab-results.component';
import { PatientInfo } from '../Features/Dashboards/patient-dashboard/patient-info/patient-info.component';
import { Visitis } from '../Features/Dashboards/patient-dashboard/visitis/visitis.component';
import { Login } from '../core/Authentication/login/login.component';
import { Home } from '../Features/home/main/home.component';
import { Appointments } from '../Features/Dashboards/patient-dashboard/appointments/appointments.component';
import { DoctorRegister } from '../core/Authentication/register/doctor-register/main/doctor-register.component';
import { LabRegister } from '../core/Authentication/register/lab-register/main/lab-register.component';
import { BrowseServices } from '../Features/patient-hub/browse-services.component';
import { DoctorAppointmentComponent } from '../Features/patient-hub/doctor-appointment/doctor-appointment.component';
import { DoctorDashboard } from '../Features/Dashboards/doctor-dashboard/main/doctor-dashboard.component';
import { DoctorDashboardOverview } from '../Features/Dashboards/doctor-dashboard/dashboard/dashboard.component';
import { DoctorAppointments } from '../Features/Dashboards/doctor-dashboard/appointments/appointments.component';
import { DoctorSchedule } from '../Features/Dashboards/doctor-dashboard/schedule/schedule.component';
import { DoctorNotifications } from '../Features/Dashboards/doctor-dashboard/notifications/notifications.component';
import { DoctorReports } from '../Features/Dashboards/doctor-dashboard/reports/reports.component';
import { DoctorSettings } from '../Features/Dashboards/doctor-dashboard/settings/settings.component';
import { RegisterType } from '../Features/home/register-type/register-type.component';
import { DashboardsComponent } from '../Features/Dashboards/main/dashboards.component';
import { NotFoundComponent } from '../Features/not-found/not-found.component';
import { SpinnerComponent } from '../Features/spinner/spinner.component';
import { UnauthorizedComponent } from '../Features/unauthorized/unauthorized.component';
export const routes: Routes = [
  //redirect to home if path is empty
  {
    path: '',
    redirectTo: '/dashboard/patient',
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
          { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
          { path: 'Dashboard', component: DoctorDashboardOverview },
          { path: 'Appointments', component: DoctorAppointments },
          { path: 'Schedule', component: DoctorSchedule },
          { path: 'Notifications', component: DoctorNotifications },
          { path: 'Reports', component: DoctorReports },
          { path: 'Profile', component: DoctorSettings },
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
            path: 'Visits',
            component: Visitis,
          },
          {
            path: 'Appointments',
            component: Appointments,
          },
        ],
      },
    ],
  },

  // browse services page
  {
    path: 'BrowseServices',
    component: BrowseServices,
  },
  {
    path: 'doctor-appointment',
    component: DoctorAppointmentComponent,
  },
    {
    path:'unauthorized',
    component:UnauthorizedComponent
  },
  {
    path: '**',
    component: NotFoundComponent,
  },

];
