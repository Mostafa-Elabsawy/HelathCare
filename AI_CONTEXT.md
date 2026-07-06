  # AI Context

  Fast onboarding file for future AI sessions. Read this before touching code.

  ## Project Overview

  - Purpose: Medical Pulse is an Angular healthcare web app for booking medical services, registering role-based users, and showing patient/doctor/lab dashboards.
  - Main user roles: patient, doctor, laboratory.
  - Core features:
    - Public home page with navbar, hero, services, about, CTA.
    - Role selection and multi-step registration for patient, doctor, lab.
    - Login form with role-based redirect.
    - Patient dashboard: profile, appointments, lab results, radiology reports, visits, edit personal info.
    - Doctor dashboard: overview, appointments, schedule, notifications, reports, settings.
    - lab Dashbaord
    - Patient hub (book appoinmtent , book lab tes,ai Analysis, ).

  ## Tech Stack

  - Angular: 21.x application, standalone component style.
  - TypeScript: ~5.9.2, strict mode enabled in `tsconfig.json`.
  - Build: `@angular/build:application`, Angular CLI 21.x.
  - Forms: Angular Reactive Forms.
  - State: Angular signals (`signal`, `computed`, `toSignal`).
  - UI libraries:
    - PrimeNG 21.x.
    - PrimeUIX themes, custom preset in `src/app/myPreset.ts`.
    - PrimeIcons.
    - Font Awesome CSS included from `angular.json`.
  - Styling:
    - Tailwind CSS 4.x via `@import 'tailwindcss';`.
    - `tailwindcss-primeui`.
    - Component CSS files currently exist but future work should prefer Tailwind utilities.
  - Data helpers: `egydata` for Egyptian governorates/cities.
  - Tests: Angular unit-test builder with Vitest dependency present.

  ## Architecture

  - `src/main.ts`: bootstraps standalone app.
  - `src/app/`: app shell, config, routes, PrimeNG theme preset.
  - `src/core/Authentication/`: login and registration flows.
  - `src/core/Authentication/register/{patient-register,doctor-register,lab-register}/`: role-specific multi-step registration.
  - `src/Features/home/`: public landing/home feature.
  - `src/Features/patient-hub/`: browse services page.
  - `src/Features/Dashboards/patient-dashboard/`: patient dashboard shell and child pages.
  - `src/Features/Dashboards/doctor-dashboard/`: doctor dashboard shell and child pages.
  - `src/services/`: shared services and shared model interfaces.
  - `public/`: static assets.

  ### Routing Structure

  - `''` redirects to `/home`.
  - `/home` -> `Home`.
  - `/login` -> `Login`.
  - `/register` redirects to `/register/roles`.
  - `/register/roles` -> role chooser.
  - `/register/patient` -> patient registration.
  - `/register/doctor` -> doctor registration.
  - `/register/laboratory` and `/register/lab` -> lab registration.
  - `/s` -> patient service browsing.
  - `/patient-dashboard` shell children:
    - `Patient-Info`
    - `Lab-Results`
    - `Radiology-Reports`
    - `Visits`
    - `Appointments`
  - `/doctor` and `/doctor-dashboard` both use doctor dashboard shell children:
    - `Dashboard`
    - `Appointments`
    - `Schedule`
    - `Notifications`
    - `Reports`
    - `Settings`

  ### State Management Approach

  - Prefer local Angular signals for UI state.
  - Use `computed()` for derived state.
  - Use `toSignal()` for observable interop, as in `BreakpointService`.
  - Multi-step registration stores each step as signals in parent components.
  - No global store exists yet.
  - Backend/API integration is not implemented; current data is mostly hardcoded or logged.

  ## Coding Rules (MUST FOLLOW)

  - Angular v20+ standalone components only.
  - Use signals for state management.
  - Use `inject()` instead of constructor DI.
  - Use `ChangeDetectionStrategy.OnPush`.
  - Tailwind CSS only for new UI styling.
  - No `any`; use strict typing.
  - Reactive Forms only.
  - Keep schematic filenames:
    - components: `*.component.ts/html/css`
    - services: `*.service.ts`
    - interfaces: `*.interface.ts`
  - Prefer concise, typed interfaces near feature modules unless shared globally.
  - Avoid adding NgModules.
  - Avoid template-driven forms and `ngModel`.
  - Keep route imports aligned with actual folder casing (`Features/Dashboards/...`).

  ## Important Modules

  ### App Shell

  - Purpose: bootstraps routes and PrimeNG theme.
  - Main files:
    - `src/main.ts`
    - `src/app/app.component.ts`
    - `src/app/app.config.ts`
    - `src/app/app.routes.ts`
    - `src/app/myPreset.ts`
  - Services: none.
  - Routes: all top-level app routes.

  ### Home

  - Purpose: public marketing/entry page.
  - Main components:
    - `Home`
    - `Navbar`
    - `Hero`
    - `Services`
    - `About`
    - `Cta`
    - `RegisterType`
  - Services: none.
  - Routes: `/home`, `/register/roles`.

  ### Authentication

  - Purpose: login and role-based registration.
  - Main components:
    - `Login`
    - `PatientRegister`
    - `DoctorRegister`
    - `LabRegister`
    - registration step components: `personal`, `contact`, `professional`, `medical`, `security`.
  - Services:
    - `src/services/Auth/login.service.ts` currently empty.
    - `src/services/Auth/register.service.ts` currently stubbed with empty `mainUrl`.
    - `BreakpointService` used for responsive stepper behavior.
  - Routes:
    - `/login`
    - `/register/patient`
    - `/register/doctor`
    - `/register/laboratory`
    - `/register/lab`

  ### Patient Dashboard

  - Purpose: patient profile and medical record dashboard.
  - Main components:
    - `PatientDashboard`
    - `PatientInfo`
    - `EditPersonalInfo`
    - `Appointments`
    - `LabResults`
    - `Radiology`
    - `Visitis`
  - Services: none yet.
  - Routes: `/patient-dashboard/*`.

  ### Doctor Dashboard

  - Purpose: doctor workspace.
  - Main components:
    - `DoctorDashboard`
    - `DoctorDashboardOverview`
    - `DoctorAppointments`
    - `DoctorSchedule`
    - `DoctorNotifications`
    - `DoctorReports`
    - `DoctorSettings`
  - Services: none yet.
  - Routes: `/doctor/*`, `/doctor-dashboard/*`.

  ### Patient Hub

  - Purpose: browse and navigate to patient services.
  - Main components:
    - `BrowseServices`
  - Services: none.
  - Routes: `/s`.

  ### Shared Services

  - `BreakpointService`: wraps Angular CDK `BreakpointObserver` into signals for `current`, `isMobile`, `isTablet`, `isDesktop`.
  - Auth services are placeholders and need real API methods.

  ## Current Progress

  ### Completed

  - Angular 21 app scaffold exists.
  - Standalone routing configured.
  - Public home page components exist.
  - Login UI exists with reactive form and role-based redirect.
  - Multi-step registration UIs exist for patient, doctor, lab.
  - Patient dashboard shell and child pages exist.
  - Doctor dashboard shell and child pages exist.
  - Doctor appointments uses signals, computed filtering, OnPush.
  - Doctor schedule has typed interface file and reactive form.
  - Component/service/interface filenames were normalized to schematic suffixes.
  - TypeScript app check passed with `node_modules/.bin/tsc.cmd -p tsconfig.app.json --noEmit`.

  ### In Progress

  - Registration forms collect data locally but only log final objects.
  - Dashboard screens contain mostly static/mock data.
  - Responsive layout uses `BreakpointService` in registration flows.
  - PrimeNG + Tailwind styling is mixed throughout.
  - Some components follow newer rules; many still need cleanup.

  ### TODO

  - Add real backend/API integration for login, registration, profiles, appointments, reports.
  - Replace all `any` with explicit types.
  - Add `ChangeDetectionStrategy.OnPush` to every component.
  - Remove constructor initialization patterns where possible; prefer field initializers/effects.
  - Remove `FormsModule`; use Reactive Forms only.
  - Convert custom/component CSS to Tailwind utilities where practical.
  - Add route guards for authenticated role access.
  - Add typed services for auth, appointments, profiles, lab/radiology results.
  - Add loading, error, empty, and success states.
  - Add tests for forms, services, and dashboard logic.

  ## Recent Decisions

  - File naming follows Angular schematics:
    - `register.component.ts`
    - `register.service.ts`
    - `register.interface.ts`
  - App uses standalone components and route-level component imports, not NgModules.
  - Signals are preferred for UI state and derived values.
  - PrimeNG is currently the main UI component library.
  - Tailwind is the preferred styling layer for new work.
  - Role dashboards are feature folders under `src/Features/Dashboards`.
  - Registration data contracts live beside each role registration module.
  - No backend base URL or API contract is finalized.

  ## Important Files

  - `angular.json`: Angular project config, schematics, styles, assets.
  - `package.json`: scripts and dependency versions.
  - `tsconfig.json`: strict TypeScript and Angular compiler settings.
  - `src/main.ts`: application bootstrap.
  - `src/app/app.config.ts`: providers, router, PrimeNG theme.
  - `src/app/app.routes.ts`: full route map.
  - `src/app/myPreset.ts`: PrimeNG theme preset.
  - `src/styles.css`: global Tailwind imports and PrimeNG overrides.
  - `src/services/break-point-observer.service.ts`: responsive signal service.
  - `src/services/Auth/login.service.ts`: auth login placeholder.
  - `src/services/Auth/register.service.ts`: registration API placeholder.
  - `src/core/Authentication/login/login.component.ts`: login form and redirect.
  - `src/core/Authentication/register/patient-register/patient-register.component.ts`: patient registration orchestration.
  - `src/core/Authentication/register/doctor-register/doctor-register.component.ts`: doctor registration orchestration.
  - `src/core/Authentication/register/lab-register/lab-register.component.ts`: lab registration orchestration.
  - `src/Features/Dashboards/patient-dashboard/main/patient-dashboard.component.ts`: patient dashboard shell.
  - `src/Features/Dashboards/doctor-dashboard/main/doctor-dashboard.component.ts`: doctor dashboard shell.
  - `src/Features/Dashboards/doctor-dashboard/appointments/appointments.component.ts`: most modern dashboard example.
  - `src/Features/Dashboards/doctor-dashboard/schedule/schedule.component.ts`: schedule form.
  - `src/Features/Dashboards/doctor-dashboard/schedule/schedule.interface.ts`: schedule types/constants.

  ## Known Issues

  - Full `npm.cmd run build` previously failed inside sandbox due directory access restrictions; TypeScript check passed.
  - Many components lack `ChangeDetectionStrategy.OnPush`.
  - Several files still use `any`.
  - Some components import `FormsModule`, violating Reactive Forms only rule.
  - Auth services are empty/stubbed.
  - Registration `submitForm()` methods only `console.log`.
  - Login only redirects by selected role; no authentication.
  - Some dashboard pages are placeholders/static HTML.
  - `Visitis` appears misspelled; consider renaming to `Visits`.
  - `ContatactDataSchema`, `defaultMeicalData`, and `Insurace_providers` are misspelled in interfaces.
  - `DoctorSchedule` contains `doSomthing()` typo and unused imports/constants.
  - Component CSS files remain; new styling should use Tailwind.
  - Routes use capitalized child path segments (`Patient-Info`, `Lab-Results`, etc.); changing them would affect links.

  ## Next Steps

  - Refactor all components to OnPush.
  - Remove `any` with typed interfaces.
  - Remove `FormsModule` usage.
  - Implement real auth/register services with typed request/response models.
  - Add guards for patient/doctor/lab routes.
  - Normalize spelling mistakes in public APIs carefully.
  - Add tests for registration step validity and dashboard filtering.
  - Run full build outside restricted sandbox when possible.
