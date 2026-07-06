# Chapter X: Front-End Development

---

## 1. Introduction

**Purpose of this chapter:**  
This chapter documents the architectural decisions, implementation details, component hierarchy, and technical design of the Medical-Pulse Angular front-end application. It serves as a comprehensive reference for developers and stakeholders to understand how the user interface was built, how data flows through the system, and what patterns were adopted to ensure maintainability and scalability.

**Relation to overall system:**  
The front-end is the user-facing single-page application (SPA) that consumes REST APIs hosted at `https://healthsystem.runasp.net/api`. It handles authentication via JWT tokens, routes users to role-specific dashboards, provides multi-step registration flows for three user roles, enables appointment booking, and manages lab test results. The front-end is the presentation layer that translates backend healthcare data into an intuitive, responsive user experience.

**Chapter roadmap:**

| Section | Topic |
|---|---|
| §2 | Technologies & Tools Used |
| §3 | UI/UX Design Process |
| §4 | Front-End Architecture |
| §5 | Implementation of Major Features |
| §6 | API Integration |
| §7 | Forms & Validation |
| §8 | Responsiveness & Accessibility |
| §9 | Performance Optimization |
| §10 | Security Considerations |
| §11 | Testing |
| §12 | Challenges & Solutions |
| §13 | Chapter Summary |

**Figure/Table Placeholder:**  
[Insert figure: High-level system context diagram showing Front-End ↔ API ↔ Backend]

---

## 2. Technologies & Tools Used

**Framework:**  
Angular 21.2.0 — chosen for its mature ecosystem, strong typing with TypeScript, standalone component architecture (no NgModules required), built-in Signals for reactivity, and functional interceptors for HTTP middleware. Angular's CLI provides robust scaffolding and build optimization.

**Libraries:**

| Library | Version | Purpose |
|---|---|---|
| `primeng` | ^21.0.0 | 60+ UI components (dialogs, steppers, selects, buttons, file upload, date pickers, split buttons, chips, input groups) |
| `primeicons` | ^7.0.0 | Icon set used alongside Font Awesome |
| `@fortawesome/fontawesome-free` | ^7.3.0 | Icon library for sidebar navigation, stat cards, and feature icons |
| `tailwindcss` | ^4.1.12 | Utility-first CSS framework for rapid, consistent styling |
| `tailwindcss-primeui` | ^0.6.1 | Bridge integrating PrimeNG design tokens with Tailwind CSS v4 |
| `egydata` | ^1.1.1 | Egyptian governorate and city dataset for cascading location dropdowns |
| `@angular/cdk` | ^21.2.0 | BreakpointObserver for responsive breakpoint detection |
| `rxjs` | ~7.8.0 | Reactive extensions used with Angular HttpClient |

**Development tools:**

| Tool | Version | Purpose |
|---|---|---|
| Angular CLI | ^21.2.15 | Project scaffolding, build, serve, and lint |
| TypeScript | ~5.9.2 | Type-safe JavaScript superset |
| PostCSS | ^8.5.3 | CSS processing with Tailwind plugin |
| Prettier | ^3.8.1 | Code formatting |
| Vitest | ^4.0.8 | Test runner (listed, not yet configured) |

**Justification table:**

| Technology | Alternatives Considered | Why Chosen | Key Benefits |
|---|---|---|---|
| Angular 21 | React 19, Vue 3 | Enterprise-grade framework with built-in routing, HTTP client, and form validation | Standalone components, Signals, strong typing, CLI tooling |
| PrimeNG 21 | Material Design, ng-bootstrap | Extensive healthcare-suitable components (stepper, splitbutton, fileupload), consistent API | 60+ components, accessibility support, Tailwind integration |
| Tailwind CSS 4 | SCSS modules, Styled Components | Utility-first approach reduces CSS files, consistent design tokens | Rapid prototyping, responsive prefixes, small bundle |
| Angular Signals | NgRx, RxJS BehaviorSubjects | Built-in reactivity without external dependencies | Fine-grained updates, no boilerplate, OnPush-friendly |
| egydata | Manual JSON data | Accurate, up-to-date Egyptian administrative dataset | Cascading governorate→city, ready-to-use API |

**Figure/Table Placeholder:**  
[Insert table: Technology justification matrix — 4 columns: Technology, Alternative(s), Why Chosen, Key Benefits]

---

## 3. UI/UX Design Process

**Design principles:**  
- **Role-consistent theming:** Each user role has a distinct accent color — Doctor (emerald green `#10b981`), Lab (violet `#8b5cf6`), Patient (blue `#3b82f6`). This provides immediate visual orientation.
- **Glassmorphism cards:** Dashboard cards use `bg-white/70 backdrop-blur-xl` for a frosted-glass effect with subtle borders (`border-gray-100`).
- **Consistent radius hierarchy:** `rounded-2xl` for cards, `rounded-xl` for inner containers and buttons, `rounded-full` for badges and avatars.
- **Shadow layering:** `shadow-sm` for cards, `shadow-md` for stat cards (hover emphasis), `shadow-lg` for interactive elements on hover.
- **Neutral backgrounds:** Page background `bg-gray-50` ensures content contrast while keeping the interface clean.

**Wireframes:**

The application follows three primary layout patterns:

1. **Home Page (public):**  
   `Navbar (sticky)` → `Hero Section` → `CTA Banner` → `About Section` → `Services Grid` → `Footer`  
   Each section is a standalone component composed in `HomeComponent`.

2. **Dashboard Layout (authenticated):**  
   ```
   ┌──────────┬────────────────────────────────────────┐
   │          │  Header (sticky, glassmorphism)          │
   │ Sidebar  ├────────────────────────────────────────┤
   │ (fixed,  │                                        │
   │  w-64)   │  <router-outlet>                       │
   │          │  (child route content)                  │
   │          │                                        │
   └──────────┴────────────────────────────────────────┘
   ```
   - Sidebar: `fixed lg:sticky` — fixed overlay on mobile, sticky inline on desktop
   - Mobile toggle via hamburger with `-translate-x-full` / `translate-x-0` transition
   - Dark overlay backdrop on mobile (`bg-black/40 backdrop-blur-sm`)

3. **Registration Layout (multi-step):**  
   PrimeNG `p-stepper` with `fluid` binding for responsive adaptation. Each step is a child component emitting `{value, valid}` to the parent container.

**Design system:**  
- **PrimeNG Theme Preset** (`src/app/myPreset.ts`): Custom Aura-based preset with blue primary palette, applied via `providePrimeNG()` in `app.config.ts`
- **CSS Variables** (`src/styles.css`): `--main: #67aeea`, custom stepper separator sizes, chip color variants (red, yellow, blue, purple, sm)
- **Dark mode:** Configured via `darkModeSelector: '.my-app-dark'` but not actively used
- **Typography:** Font sizing scales from `text-xs` to `text-4xl`; headings use `font-bold` or `font-semibold` with `tracking-tight`

**Usability considerations:**  
- Mobile hamburger menu with backdrop overlay to prevent accidental interaction
- Sticky headers with backdrop blur for visual hierarchy
- Status color-coding (green=completed/confirmed, yellow=pending, red=cancelled/declined, blue=in progress)
- Glassmorphism cards with hover shadows for interactive affordance
- Form validation feedback via PrimeNG's built-in error states
- PrimeNG components are keyboard-navigable and include ARIA attributes

**Figure/Table Placeholder:**  
[Insert figure: Home page wireframe — Navbar, Hero, CTA, About, Services, Footer]  
[Insert figure: Dashboard layout — annotated sidebar, header, content area with router-outlet]

---

## 4. Front-End Architecture

**Folder structure:**

```
src/
├── app/
│   ├── app.config.ts                  # Application providers (HTTP, PrimeNG, Router)
│   ├── app.routes.ts                  # All route definitions (eagerly loaded)
│   ├── app.component.ts               # Root component
│   └── myPreset.ts                    # Custom PrimeNG Aura theme preset
│
├── core/
│   ├── Authentication/
│   │   ├── login/
│   │   │   └── login.component.ts     # Login form with role selection (radio buttons)
│   │   └── register/
│   │       ├── doctor-register/
│   │       │   ├── doctor-register.interface.ts   # Doctor specialty enum + schemas
│   │       │   ├── main/
│   │       │   │   └── doctor-register.component.ts  # 3-step stepper container
│   │       │   ├── personal/
│   │       │   │   └── personal.component.ts      # Step 1: name, gender, ID, specialty
│   │       │   ├── contact/
│   │       │   │   └── contact.component.ts       # Step 2: email, phone, location
│   │       │   └── security/
│   │       │       └── security.component.ts      # Step 3: password, terms
│   │       ├── lab-register/
│   │       │   ├── lab-register.interface.ts      # Lab info schema + test categories
│   │       │   ├── main/
│   │       │   │   └── lab-register.component.ts  # 2-step stepper container
│   │       │   ├── Lab-informations/
│   │       │   │   └── lab-informations.component.ts  # Step 1: name, email, phone, location
│   │       │   └── security/
│   │       │       └── security.component.ts      # Step 2: password, terms
│   │       └── patient-register/
│   │           ├── patient-register.interface.ts  # Patient schemas + blood groups
│   │           ├── main/
│   │           │   └── patient-register.component.ts  # 4-step stepper container
│   │           ├── personal/
│   │           │   └── personal.component.ts      # Step 1: name, DOB, gender, national ID
│   │           ├── contact/
│   │           │   └── contact.component.ts       # Step 2: email, phone, location
│   │           ├── medical/
│   │           │   └── medical.component.ts       # Step 3: allergies, conditions, blood type
│   │           └── security/
│   │               └── security.component.ts      # Step 4: password, terms
│   └── interceptors/
│       ├── jwt-interceptor.ts          # Attaches Bearer token, respects skipAuth header
│       ├── auth-error-interceptor.ts   # Handles 400-504 status codes
│       └── success-interceptor.ts      # Logs successful responses per HTTP method
│
├── environments/
│   ├── environment.ts                  # Development API URL
│   └── environment.prod.ts            # Production API URL (same endpoint)
│
├── Features/
│   ├── Dashboards/
│   │   ├── main/
│   │   │   └── dashboards.component.ts # Parent wrapper, monitors role via effect()
│   │   ├── doctor-dashboard/
│   │   │   ├── main/
│   │   │   │   └── doctor-dashboard.component.ts  # Shell: sidebar + router-outlet
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts         # Overview: stats, requests, queue
│   │   │   ├── appointments/
│   │   │   │   └── appointments.component.ts      # Filtered appointment list + dialog
│   │   │   ├── schedule/
│   │   │   │   ├── schedule.component.ts          # Working hours/days/price + edit
│   │   │   │   └── schedule.interface.ts          # Hours, WorkingDay types
│   │   │   ├── notifications/
│   │   │   │   └── notifications.component.ts     # Alert cards + filter sidebar
│   │   │   ├── reports/
│   │   │   │   └── reports.component.ts           # Report stats + recent list
│   │   │   ├── settings/
│   │   │   │   └── settings.component.ts          # Profile display + edit trigger
│   │   │   └── edit/
│   │   │       └── edit-doctor-info.component.ts  # Profile edit dialog (PrimeNG dialog)
│   │   ├── patient-dashboard/
│   │   │   ├── main/
│   │   │   │   └── patient-dashboard.component.ts # Shell: sidebar + router-outlet
│   │   │   ├── patient-info/
│   │   │   │   └── patient-info.component.ts      # Personal info display + edit
│   │   │   ├── lab-results/
│   │   │   │   └── lab-results.component.ts       # Patient-facing lab results
│   │   │   ├── visitis/
│   │   │   │   └── visitis.component.ts           # Visit history
│   │   │   ├── appointments/
│   │   │   │   └── appointments.component.ts      # Patient appointment management
│   │   │   └── edit-personal-info/
│   │   │       └── edit-personal-info.component.ts # Patient profile edit dialog
│   │   └── lab-dashboard/
│   │       ├── main/
│   │       │   └── lab-dashboard.component.ts     # Shell: sidebar + router-outlet
│   │       ├── dashboard/
│   │       │   └── dashboard.component.ts         # Overview: stats, test requests, queue
│   │       ├── tests/
│   │       │   └── tests.component.ts             # Filtered test list + dialog (4 statuses)
│   │       ├── upload/
│   │       │   └── upload.component.ts            # Upload stats + recent uploads list
│   │       ├── results/
│   │       │   └── results.component.ts           # Completed results list
│   │       ├── profile/
│   │       │   └── profile.component.ts           # Lab profile display + edit
│   │       └── edit/
│   │           └── edit-lab-info.component.ts     # Lab profile edit dialog
│   ├── home/
│   │   ├── main/
│   │   │   └── home.component.ts                  # Home page container
│   │   ├── navbar/
│   │   │   └── navbar.component.ts                # Sticky navigation bar
│   │   ├── hero/
│   │   │   └── hero.component.ts                  # Landing hero section
│   │   ├── about/
│   │   │   └── about.component.ts                 # About us section
│   │   ├── services/
│   │   │   └── services.component.ts              # Healthcare services overview
│   │   ├── cta/
│   │   │   └── cta.component.ts                   # Call-to-action banner
│   │   └── register-type/
│   │       └── register-type.component.ts         # Role selection for registration
│   ├── patient-hub/
│   │   ├── browse-services.component.ts            # Service browsing page
│   │   └── doctor-appointment/
│   │       └── doctor-appointment.component.ts     # Doctor listing, filters, booking dialog
│   ├── not-found/
│   │   └── not-found.component.ts                  # 404 page
│   ├── spinner/
│   │   └── spinner.component.ts                    # Loading spinner
│   └── unauthorized/
│       └── unauthorized.component.ts               # 401 unauthorized page
│
├── models/
│   ├── auth.interface.ts              # LoginAPI, LoginResponseAPI
│   ├── patient-api.interface.ts       # RegisterPatientAPI, PatientProfileResponseAPI
│   ├── doctor-api.interface.ts        # RegisterDoctorAPI, DoctorProfileResponseAPI
│   ├── doctor.interface.ts            # Doctor display model
│   └── appointment-interface.ts       # Appointment data model
│
├── services/
│   ├── Auth/
│   │   └── login.service.ts           # Auth state (signals), login/logout, localStorage persistence
│   ├── login.service.ts               # Duplicate of above (legacy)
│   ├── doctor.service.ts              # Doctor CRUD with signals
│   ├── doctor/
│   │   └── doctor.service.ts          # Duplicate (legacy, signal-free)
│   ├── patient.service.ts             # Patient CRUD with signals
│   ├── Patient/
│   │   └── patient.service.ts         # Duplicate (legacy)
│   ├── appointment.service.ts         # Placeholder (empty class)
│   ├── break-point-observer.service.ts # CDK BreakpointObserver + toSignal wrapper
│   └── models/
│       ├── auth.interface.ts          # Duplicate of src/models/auth.interface.ts
│       ├── patient-api.interface.ts   # Duplicate
│       ├── doctor-api.interface.ts    # Duplicate
│       └── appointment-interface.ts   # Duplicate
│
├── index.html                         # SPA entry point
├── main.ts                            # Angular bootstrap
└── styles.css                         # Tailwind imports, global CSS, custom utilities
```

**Component architecture:**  
All components are **standalone** (no NgModules). The architecture follows a **shell + child route** pattern for dashboards:

```
DashboardsComponent (parent wrapper, role-redirect logic)
├── DoctorDashboard (shell: sidebar + router-outlet)
│   ├── DoctorDashboardOverview    [/dashboard/doctor/Dashboard]
│   ├── DoctorAppointments         [/dashboard/doctor/Appointments]
│   ├── DoctorSchedule             [/dashboard/doctor/Schedule]
│   ├── DoctorNotifications        [/dashboard/doctor/Notifications]
│   ├── DoctorReports              [/dashboard/doctor/Reports]
│   └── DoctorSettings             [/dashboard/doctor/Profile]
├── PatientDashboard (shell: sidebar + router-outlet)
│   ├── PatientInfo                [/dashboard/patient/Patient-Info]
│   ├── LabResults                 [/dashboard/patient/Lab-Results]
│   ├── Visitis                    [/dashboard/patient/Visits]
│   └── Appointments               [/dashboard/patient/Appointments]
└── LabDashboard (shell: sidebar + router-outlet)
    ├── LabDashboardOverview       [/dashboard/lab/Dashboard]
    ├── LabTests                   [/dashboard/lab/Tests]
    ├── LabUpload                  [/dashboard/lab/Upload]
    ├── LabResultsView             [/dashboard/lab/Results]
    └── LabProfile                 [/dashboard/lab/Profile]
```

Data flow within the registration stepper follows a **child-emit / parent-aggregate** pattern:
- Each step component receives no input and emits `{value, valid}` via `output()`
- The parent container stores each step's data in separate `WritableSignal` instances
- On submit, the parent spreads all step values into a single API request object

**Routing:**

All routes are **eagerly loaded** (no `loadComponent` or `loadChildren`). No route guards are configured.

| Path | Component | Notes |
|---|---|---|
| `''` | redirect → `/dashboard/patient` | Default redirect |
| `/home` | `HomeComponent` | Public landing page |
| `/register` | (children) | Registration flow |
| `/register/roles` | `RegisterType` | Role selection |
| `/register/patient` | `PatientRegister` | 4-step stepper |
| `/register/doctor` | `DoctorRegister` | 3-step stepper |
| `/register/laboratory` | `LabRegister` | 2-step stepper |
| `/register/lab` | `LabRegister` | Alias |
| `/login` | `LoginComponent` | Login form |
| `/dashboard` | `DashboardsComponent` | Role-based wrapper |
| `/dashboard/doctor` | `DoctorDashboard` (children) | 6 child routes |
| `/dashboard/patient` | `PatientDashboard` (children) | 4 child routes |
| `/dashboard/lab` | `LabDashboard` (children) | 5 child routes |
| `/BrowseServices` | `BrowseServices` | Service listing |
| `/doctor-appointment` | `DoctorAppointmentComponent` | Booking page |
| `/unauthorized` | `UnauthorizedComponent` | 401 page |
| `**` | `NotFoundComponent` | 404 catch-all |

**State management:**  
The project uses **Angular Signals** exclusively — no NgRx, Akita, or external state library.

**Service-level signals:**

| Service | Signals | Computeds |
|---|---|---|
| `AuthService` | `user`, `loading` | `token`, `role`, `loggedIn` |
| `DoctorService` | `doctor`, `appointments`, `loading`, `error` | `appointmentCount` |

**Component-level signals (key examples):**

| Component | Signals | Computeds |
|---|---|---|
| `DoctorAppointments` | `selectedStatus`, `selectedAppointment`, `detailsVisible`, `appointments` | `filteredAppointments`, `todayAppointments`, `upcomingAppointments`, `statusCounts` |
| `LabTests` | `selectedStatus`, `selectedTest`, `detailsVisible`, `tests` | `filteredTests`, `todayTests`, `upcomingTests`, `statusCounts` |
| `DoctorAppointmentComponent` | `doctors`, `searchQuery`, `selectedSpecialty`, `selectedDay`, `selectedGender`, `selectedRating`, `sortBy` | `filteredDoctors` (6-step pipeline) |
| `DashboardsComponent` | — | `RoleType` with `effect()` for redirect |
| `DoctorSchedule` | `StartHourOptions`, `EndHourOptions`, `working_days`, `editMode` | `EndHourOptions` (derived) |
| `EditDoctorInfoComponent` | `editDialogVisible`, `imagePreview`, `profileFileName` | — |

**Service/API layer:**  
- `HttpClient` provided via `provideHttpClient(withInterceptors([jwtInterceptor, authErrorInterceptor, successInterceptor]))` in `app.config.ts`
- All services use `providedIn: 'root'`
- API methods return `Observable<T>` consumed via `.subscribe()` in components
- The `skipAuth` header mechanism allows login/register endpoints to bypass JWT attachment

**Figure/Table Placeholder:**  
[Insert figure: Architecture diagram — Browser → Angular SPA → Interceptors (JWT, Error, Success) → Services → REST API → Backend]  
[Insert figure: Component tree for doctor dashboard showing shell → child routes → PrimeNG dialogs]

---

## 5. Implementation of Major Features

### 5.1 Multi-Role Registration System

**Purpose:**  
Allow new users to register as Patient, Doctor, or Laboratory through a guided multi-step stepper interface. Each role has a tailored set of fields appropriate to their profile data requirements.

**Components:**

| Component | Steps | Selector |
|---|---|---|
| `DoctorRegister` | 3 (Personal → Contact → Security) | `app-doctor-register` |
| `PatientRegister` | 4 (Personal → Contact → Medical → Security) | `app-patient-register` |
| `LabRegister` | 2 (Lab Information → Security) | `app-lab-register` |

**Services consumed:**

| Service | Method | Endpoint |
|---|---|---|
| `DoctorService` | `registerDoctor(data)` | `POST /api/Doctors` (skipAuth) |
| `PatientService` | `registerPatient(data)` | `POST /api/Patients` (skipAuth) |
| Lab registration | Logs to console | No service call implemented |

**Data flow:**

```
Step Component (child)
  │  emits { value: {...}, valid: boolean } via output()
  ▼
Parent Container (stepper host)
  │  stores each step in WritableSignal
  │  on submit: spreads all signals + password into API object
  ▼
Service.register*(finalObject).subscribe()
  │
  ▼
API → Response → navigate to /login
```

**Validation rules per step:**

| Role | Step | Fields | Validators |
|---|---|---|---|
| Doctor | 1 - Personal | firstName, lastName, gender, nationalID, specialty, medicalLevel | required, pattern(`^[0-9]{8}$`) for ID |
| Doctor | 2 - Contact | email, phone, governorate, city, address | required, email, pattern phone `^0?1[1\|2\|5\|0][0-9]{8}$` |
| Doctor | 3 - Security | password, confirmPassword, checkBox | required, pattern(uppercase+lowercase+digit+special), requiredTrue |
| Patient | 1 - Personal | firstName, middleName, lastName, dateOfBirth, gender, nationalID | required, date validation |
| Patient | 2 - Contact | email, phone, governorate, city, address | Same as Doctor |
| Patient | 3 - Medical | allergies[], chronic[], previousSurgery[], bloodGroup, hasInsurance | required for type selections |
| Patient | 4 - Security | password, confirmPassword, checkBox | Same as Doctor |
| Lab | 1 - Info | name, email, phone, governorate, city, address | required, email, pattern phone |
| Lab | 2 - Security | password, confirmPassword, checkBox | Same as Doctor |

**User flow:**

```
Landing Page → Register → Select Role (RegisterType)
  ├── Patient → 4-step stepper → submit → /login
  ├── Doctor  → 3-step stepper → submit → /login
  └── Lab     → 2-step stepper → submit → /login
```

**Screenshot placeholder:**  
[Insert screenshot: Doctor registration stepper showing step 1 (Personal Information) with PrimeNG p-stepper]

---

### 5.2 Doctor Dashboard (Emerald Theme)

**Purpose:**  
Central hub for doctors to manage appointments, work schedule, patient reports, notifications, and personal profile.

**Components:**

| Component | Route | Key Features |
|---|---|---|
| `DoctorDashboardOverview` | `/dashboard/doctor/Dashboard` | 4 stat cards (Total Patients, Appointments Today, Rating, Revenue), New Requests grid with Accept/Decline, Today Queue list |
| `DoctorAppointments` | `/dashboard/doctor/Appointments` | 3-status filter (Confirmed/Completed/Canceled), today/upcoming split, PrimeNG dialog with patient details, SplitButton for actions |
| `DoctorSchedule` | `/dashboard/doctor/Schedule` | Preview card (hours, price, days), edit button opens PrimeNG dialog with form (Select, InputNumber, day toggles) |
| `DoctorNotifications` | `/dashboard/doctor/Notifications` | Alert cards (urgent ECG, appointment, lab report), filter sidebar (All/Clinical/Appointments/Reports) |
| `DoctorReports` | `/dashboard/doctor/Reports` | 4 stat cards + recent report list with type icons and status badges |
| `DoctorSettings` | `/dashboard/doctor/Profile` | Profile display (photo, name, specialty, contact), personal/contact info grids, embedded EditDoctorInfoComponent |

**Services consumed:**

| Service | Methods |
|---|---|
| `DoctorService` | `loadDoctorProfile()`, `updateDoctorProfile()`, `loadAppointments()`, `acceptAppointment()`, `rejectAppointment()`, `updateSchedule()` |

**Key signals pattern (DoctorAppointments):**

```typescript
// Status filter
selectedStatus = signal<AppointmentStatus>('Confirmed');
// Filtered list
filteredAppointments = computed(() =>
  appointments().filter(a => a.status === selectedStatus()));
// Sub-splits by period
todayAppointments = computed(() =>
  filteredAppointments().filter(a => a.period === 'today'));
upcomingAppointments = computed(() =>
  filteredAppointments().filter(a => a.period === 'upcoming'));
// Status counts for tab badges
statusCounts = computed(() =>
  statuses.map(s => ({ status: s, count: appointments().filter(a => a.status === s).length })));
```

**User flow:**

```
Login (doctor role) → /dashboard (redirect to /dashboard/doctor)
  ├── Dashboard → View stats, accept/decline requests, monitor queue
  ├── Appointments → Filter by status, view details in dialog
  ├── Schedule → View/preview, edit hours/days/price
  ├── Notifications → Review alerts, filter by category
  ├── Reports → View report stats, browse recent reports
  └── Profile → View info, open edit dialog, save changes
```

**Screenshot placeholder:**  
[Insert screenshot: Doctor Dashboard overview with stat cards, new requests grid, and today queue]

---

### 5.3 Lab Dashboard (Violet Theme)

**Purpose:**  
Lab staff dashboard for managing test orders, uploading result documents, and tracking completed reports.

**Components:**

| Component | Route | Key Features |
|---|---|---|
| `LabDashboardOverview` | `/dashboard/lab/Dashboard` | 4 stat cards (Total Tests, Pending, Completed, Patients Served), New Test Requests with Accept/Decline, Today's Queue |
| `LabTests` | `/dashboard/lab/Tests` | 4-status filter (Pending/In Progress/Completed/Cancelled), today/upcoming split, PrimeNG dialog with patient + test details, SplitButton actions |
| `LabUpload` | `/dashboard/lab/Upload` | 4 stat cards (Uploads Today, Pending, Verified, Processing Time), Recent Uploads list with type icons and status badges |
| `LabResultsView` | `/dashboard/lab/Results` | 4 stat cards (Total Results, Reviewed, Pending, Abnormal), Completed Results list with review status |
| `LabProfile` | `/dashboard/lab/Profile` | Profile display (name, location, contact), basic + contact info grids, embedded EditLabInfoComponent |

**Services consumed:**  
No dedicated lab service exists. Profile editing logs to console only.

**Key signals pattern (LabTests):**

```typescript
// 4 statuses (doctor has 3)
type TestStatus = 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
// Same computed pipeline as DoctorAppointments
filteredTests = computed(() => tests().filter(t => t.status === selectedStatus()));
todayTests = computed(() => filteredTests().filter(t => t.period === 'today'));
upcomingTests = computed(() => filteredTests().filter(t => t.period === 'upcoming'));
```

**User flow:**

```
Login (lab role) → /dashboard (redirect to /dashboard/lab)
  ├── Dashboard → View lab stats, accept/decline test requests, monitor queue
  ├── Tests → Filter by status, view patient & test details in dialog
  ├── Upload Results → View upload stats, browse recent uploads
  ├── Results → View completed results, identify pending reviews
  └── Profile → View lab info, open edit dialog, save changes
```

**Screenshot placeholder:**  
[Insert screenshot: Lab Dashboard overview with violet-themed stat cards and test requests]

---

### 5.4 Patient Dashboard (Blue Theme)

**Purpose:**  
Patient hub for managing personal information, reviewing lab results, tracking appointments, and viewing visit history.

**Components:**

| Component | Route | Key Features |
|---|---|---|
| `PatientInfo` | `/dashboard/patient/Patient-Info` | Personal profile display + edit, medical history (allergies, chronic conditions), appointment count |
| `LabResults` | `/dashboard/patient/Lab-Results` | Patient-facing lab results view |
| `Appointments` | `/dashboard/patient/Appointments` | Patient appointment list with SplitButton actions |
| `Visitis` | `/dashboard/patient/Visits` | Visit history timeline |

**Services consumed:**

| Service | Methods |
|---|---|
| `PatientService` | `getPatientProfile()`, `updatePatientProfile()`, `uploadProfileImage()` |

**User flow:**

```
Login (patient role) → /dashboard/patient
  ├── Patient-Info → View/edit personal info, medical history
  ├── Lab-Results → View completed lab reports
  ├── Appointments → View/manage appointments
  └── Visits → Review past visits
```

**Screenshot placeholder:**  
[Insert screenshot: Patient dashboard sidebar and personal info view]

---

### 5.5 Doctor Appointment Booking System

**Purpose:**  
Allow patients to browse available doctors, filter by multiple criteria, view doctor profiles, and book appointments.

**Component:** `DoctorAppointmentComponent` (standalone, `app-doctor-appointment`)

**State signals (10 total):**

| Signal | Type | Purpose |
|---|---|---|
| `doctors` | `WritableSignal<Doctor[]>` | Full doctor list (7 hardcoded) |
| `searchQuery` | `WritableSignal<string>` | Text search across name, specialty, location |
| `selectedSpecialty` | `WritableSignal<string \| null>` | Specialty filter |
| `selectedDay` | `WritableSignal<string \| null>` | Working day filter |
| `selectedGender` | `WritableSignal<string \| null>` | Gender filter |
| `selectedRating` | `WritableSignal<number \| null>` | Minimum rating filter |
| `sortBy` | `WritableSignal<string>` | Sort mode (rating, price asc, price desc) |
| `displayBookingDialog` | `WritableSignal<boolean>` | Booking dialog visibility |
| `selectedDoctorForBooking` | `WritableSignal<Doctor \| null>` | Doctor selected for booking |
| `bookingSuccess` | `WritableSignal<boolean>` | Booking confirmation state |

**Filter pipeline (6-step computed):**

```typescript
filteredDoctors = computed(() => {
  let list = this.doctors();
  // Step 1: Search query (name, specialty, city, governorate)
  if (query) list = list.filter(d => /* fuzzy match */);
  // Step 2: Specialty exact match
  if (specialty) list = list.filter(d => d.specialty === specialty);
  // Step 3: Working day availability
  if (day) list = list.filter(d => d.workingDays.includes(day));
  // Step 4: Gender filter
  if (gender) list = list.filter(d => d.gender === gender);
  // Step 5: Minimum rating threshold
  if (rating) list = list.filter(d => d.rating >= rating);
  // Step 6: Sort (clone first to avoid mutation)
  list = [...list].sort((a, b) => ...);
  return list;
});
```

**Filter options:**

| Filter | Options | Source |
|---|---|---|
| Specialty | 10 (All + 9 specialties) | Hardcoded array |
| Day | 8 (Any Day + Sunday-Saturday) | Hardcoded array |
| Gender | 3 (All, Male, Female) | Hardcoded array |
| Rating | 4 (Any, 4.8+, 4.5+, 4.0+) | Hardcoded array |
| Sort | 3 (Top Rated, Price Low→High, Price High→Low) | Hardcoded array |

**Booking form:**

```typescript
bookingForm = new FormGroup({
  appointmentDate: new FormControl<Date | null>(null, [Validators.required]),
  appointmentTime: new FormControl<string>('', [Validators.required]),
  patientName: new FormControl('', [Validators.required]),
  patientPhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
  notes: new FormControl(''),
});
```

**Booking flow:**
```
Browse doctors → Apply filters → Click "Book" → PrimeNG dialog opens
  → Select date (validates against doctor's workingDays)
  → Select time (16 slots: 09:00-18:30, 30-min increments)
  → Enter name, phone, notes
  → Submit → success message → auto-close (2500ms)
```

**Validation:**
- `isDoctorAvailableOnSelectedDate()` — checks if selected date's weekday is in doctor's `workingDays[]`
- If unavailable, sets custom error `{ doctorUnavailable: true }` on date control
- `isInvalid(controlName)` — returns true if invalid AND (touched or dirty)

**Screenshot placeholder:**  
[Insert screenshot: Doctor listing with filters (specialty, day, gender, rating, sort) and booking dialog]

---

## 6. API Integration

**Architecture:**  
The API layer follows a **service pattern** where each backend entity has a dedicated Angular service. Services are `providedIn: 'root'` singletons. HTTP calls use Angular `HttpClient` with functional interceptors registered via `withInterceptors()`.

```
Component → Service.method() → HttpClient.request()
  → jwtInterceptor (attaches Bearer token)
  → authErrorInterceptor (catches errors)
  → successInterceptor (taps responses)
  → API Server → Response → Component.subscribe()
```

**Authentication flow:**

```
Login Component
  → AuthService.login(data)           // POST /api/Auth/login (skipAuth header)
  → Backend validates credentials
  → Returns { token, role, email }
  → AuthService stores in localStorage
  → Rehydrates on app load via constructor
  → Router navigates to /dashboard

Subsequent requests:
  → jwtInterceptor reads token() signal
  → Attaches Authorization: Bearer <token>
  → Backend validates JWT
```

**Interceptors:**

| Interceptor | File | Behavior |
|---|---|---|
| `jwtInterceptor` | `core/interceptors/jwt-interceptor.ts` | Reads `AuthService.token()` signal. If `skipAuth` header present, removes it and skips token. Otherwise adds `Authorization: Bearer <token>` |
| `authErrorInterceptor` | `core/interceptors/auth-error-interceptor.ts` | 400 → log; 401 → clear token + navigate `/unauthorized`; 403 → log; 404 → log; 422 → log; 500 → log; 502/503/504 → log. Always rethrows error |
| `successInterceptor` | `core/interceptors/success-interceptor.ts` | Taps responses with status 200-299. Logs emoji-prefixed messages per method (🟢 GET, 🟡 POST, 🔵 PUT, ❌ DELETE) |

**API endpoints consumed:**

| Method | Endpoint | Service | Auth |
|---|---|---|---|
| POST | `/api/Auth/login` | `AuthService` | skipAuth |
| POST | `/api/Doctors` | `DoctorService.registerDoctor()` | skipAuth |
| POST | `/api/Patients` | `PatientService.registerPatient()` | skipAuth |
| GET | `/api/Doctors/profile` | `DoctorService.loadDoctorProfile()` | JWT |
| PUT | `/api/Doctors/profile` | `DoctorService.updateDoctorProfile()` | JWT |
| GET | `/api/Appointments/doctor/MyAppointments` | `DoctorService.loadAppointments()` | JWT |
| PUT | `/api/Appointments/approve/:id` | `DoctorService.acceptAppointment()` | JWT |
| PUT | `/api/Appointments/reject/:id` | `DoctorService.rejectAppointment()` | JWT |
| GET | `/api/Doctors/GetAllDoctors` | `DoctorService.getAllDoctors()` | skipAuth |
| GET | `/api/Patients/profile` | `PatientService.getPatientProfile()` | JWT |
| PUT | `/api/Patients/profile` | `PatientService.updatePatientProfile()` | JWT |
| POST | `/api/Patients/profile/upload-image` | `PatientService.uploadProfileImage()` | JWT |

**Loading states:**  
`DoctorService` exposes a `loading` signal that components can bind to for conditional spinner display.

**Error handling:**  
- Centralized: `authErrorInterceptor` catches and logs all errors by status code
- Service-level: `DoctorService.error` signal for component-level error display
- Component-level: `.subscribe({ next, error })` blocks for form submission feedback

**Figure/Table Placeholder:**  
[Insert figure: HTTP request flow diagram — Component → Service → JWT Interceptor → API → Error/Success Interceptor → Response]  
[Insert table: API endpoints summary — method, path, auth required, service, description]

---

## 7. Forms & Validation

**Reactive forms:**  
All forms use Angular Reactive Forms (`FormGroup` + `FormControl`) with typed controls (`FormControl<string>`) and `nonNullable: true` to prevent null values.

**Validation rules by feature:**

| Feature | Controls | Validators |
|---|---|---|
| **Login** | email, password, role | required, email, minLength(8) |
| **Doctor Registration** | | |
| Personal | firstName, lastName, gender, nationalID, specialty, medicalLevel | required, pattern(`^[0-9]{8}$`) |
| Contact | email, phone, governorate, city, address | required, email, pattern(`^0?1[1\|2\|5\|0][0-9]{8}$`) |
| Security | password, confirmPassword, checkBox | required, pattern(upper+lower+digit+special), requiredTrue |
| **Patient Registration** | | |
| Personal | firstName, middleName, lastName, dateOfBirth, gender, nationalID | required, date valid |
| Contact | email, phone, governorate, city, address | required, email, phone pattern |
| Medical | allergies[], chronic[], previousSurgery[], bloodGroup, hasInsurance | required for selects |
| Security | password, confirmPassword, checkBox | Same as Doctor |
| **Lab Registration** | | |
| Info | name, email, phone, governorate, city, address | required, email, phone pattern |
| Security | password, confirmPassword, checkBox | Same as Doctor |
| **Doctor Booking** | appointmentDate, appointmentTime, patientName, patientPhone, notes | required, pattern(`^[0-9]{11}$`), custom unavailable check |
| **Edit Doctor Profile** | firstName(disabled), lastName(disabled), nationalId(disabled), gender(disabled), email(disabled), phone, governorate, city, address, specialty, medicalLevel | required, pattern, email |
| **Edit Lab Profile** | name, email(disabled), phone, governorate, city, address | required, pattern, email |

**Password validation pattern:**

```typescript
Validators.pattern('.*[a-z].*'),   // at least one lowercase
Validators.pattern('.*[A-Z].*'),   // at least one uppercase
Validators.pattern('.*[0-9].*'),   // at least one digit
Validators.pattern('.*[!@#$%^&*].*') // at least one special character
```

**UX patterns:**

| Pattern | Implementation |
|---|---|
| Stepper navigation | `activeStep` number controlled by PrimeNG `p-stepper`. Each step must be valid to proceed |
| Form dirty tracking | `markAllAsTouched()` on submit when form invalid |
| Error display | `valid(control)` helper returns true if invalid AND (touched or dirty) |
| Debounced emission | `debounceTime(500)` on valueChanges before emitting step data to parent |
| Disabled view-only fields | Form controls with `{ disabled: true }` that display data without allowing edits |
| Cascading dropdowns | `governorate.valueChanges` subscription → clear city → fetch cities from `egydata` → update `citiesName` signal |
| Auto-close on success | Booking dialog auto-closes 2500ms after successful submission |

**Cascading location dropdown pattern (Egyptian governorate → city):**

```typescript
constructor() {
  this.GovernatesNames = governorates.getAll().map(e => e.nameEn);
  this.governorate.valueChanges.subscribe(selected => {
    this.city.reset('');                               // Clear city selection
    const gov = governorates.getAll()
      .find(e => e.nameEn === selected);               // Find governorate
    if (gov) {
      const c = cities.getAll(gov.code);               // Get cities by code
      this.citiesName.set(c.map(e => e.nameEn));       // Update city options
    }
  });
}
```

**Figure/Table Placeholder:**  
[Insert figure: Registration stepper screenshot showing PrimeNG p-stepper with 3 steps and form validation errors]  
[Insert table: Full validation rules — feature, field, rule, error message]

---

## 8. Responsiveness & Accessibility

**Responsive strategy:**  
Mobile-first approach using Tailwind CSS responsive prefixes.

| Breakpoint | Min-width | Common layout changes |
|---|---|---|
| `sm:` | 640px | Larger padding, multi-column grids, adjusted text sizes |
| `md:` | 768px | Flex direction (column→row), grid column spans, increased padding |
| `lg:` | 1024px | Sidebar becomes sticky (not overlay), complex grid layouts |
| `xl:` | 1280px | 4-column stat grids, wider containers |

**Common responsive patterns:**

```html
<!-- Grid scaling: 1 → 2 → 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Flex direction change on mobile -->
<section class="flex flex-col md:flex-row items-center justify-between">

<!-- Sidebar behavior (fixed overlay → sticky inline) -->
<aside class="fixed lg:sticky top-0 left-0 z-20 h-full w-64
            transform transition-all duration-300
            [class.-translate-x-full]="!menu()"
            [class.translate-x-0]="menu()">

<!-- Mobile overlay -->
<div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-10 lg:hidden">

<!-- Content padding scales -->
<div class="p-4 md:p-6 2xl:container mx-auto">
```

**Programmatic breakpoint detection:**

```typescript
// break-point-observer.service.ts
export class BreakpointObserverService {
  private breakpointObserver = inject(BreakpointObserver);
  readonly current: Signal<'xs'|'sm'|'md'|'lg'|'xl'>;
  readonly isMobile: Signal<boolean>;   // xs or sm
  readonly isTablet: Signal<boolean>;   // md
  readonly isDesktop: Signal<boolean>;  // lg or xl
}
```

Used in registration forms for PrimeNG `[fluid]` binding:
```typescript
fluidCheck = computed(() => this.breakpointService.isMobile());
// Template: <p-stepper [fluid]="fluidCheck()">
```

**Accessibility:**  
- PrimeNG components include built-in ARIA labels, keyboard navigation, and focus management
- Semantic HTML structure: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`
- Filter buttons use `[attr.aria-pressed]` for active state
- Form controls have proper `<label>` associations
- Color contrast maintained via Tailwind's accessible color palette
- Interactive elements have hover and focus states

**Cross-browser testing:**  
- Tailwind PostCSS autoprefixer handles vendor prefixes for CSS
- PrimeNG components are tested across modern browsers (Chrome, Firefox, Safari, Edge)
- Angular framework abstracts browser inconsistencies
- No polyfills required for supported browser targets

**Figure/Table Placeholder:**  
[Insert screenshot: Dashboard on desktop (1280px+)]  
[Insert screenshot: Dashboard on tablet (768px)]  
[Insert screenshot: Dashboard on mobile (375px) with sidebar overlay]  
[Insert table: Responsive breakpoints — name, min-width, layout changes per component]

---

## 9. Performance Optimization

**Lazy loading:**  
Not implemented. All components are eagerly loaded via direct imports in `app.routes.ts`. This is a identified improvement opportunity for v2. Build output produces a single `main-*.js` bundle.

**Signals:**  
Angular Signals provide granular reactivity without `ChangeDetectorRef.markForCheck()`. Key examples:

```typescript
// Computed signals trigger only when dependencies change
filteredAppointments = computed(() =>
  appointments().filter(a => a.status === selectedStatus()));

// Status counts recompute only when appointments or statuses change
statusCounts = computed(() =>
  statuses.map(s => ({
    status: s,
    count: appointments().filter(a => a.status === s).length,
  })));
```

**OnPush change detection:**  
Used in 3 components:

| Component | File |
|---|---|
| `DoctorAppointments` | `.../doctor-dashboard/appointments/appointments.component.ts` |
| `DoctorSchedule` | `.../doctor-dashboard/schedule/schedule.component.ts` |
| `LabTests` | `.../lab-dashboard/tests/tests.component.ts` |

Signals mitigate OnPush's manual change detection requirement — Angular automatically marks signal-dependent views as dirty when signal values change.

**trackBy:**  
Not used in any `@for` loops. Identified as an improvement opportunity to reduce DOM churn during list re-renders.

**Code splitting:**  
None applied. All routes use direct imports (eager loading).

**Bundle analysis:**

| Chunk | Raw Size | Transfer Size |
|---|---|---|
| `main-ATOJBBCM.js` | 1.44 MB | 260.44 kB |
| `styles-BBCWZ2GA.css` | 76.74 kB | 10.76 kB |
| **Total** | **1.52 MB** | **271.20 kB** |

**Angular.json build settings:**

| Setting | Value |
|---|---|
| Builder | `@angular/build:application` |
| Optimization (production) | enabled (output hashing: "all") |
| Optimization (development) | disabled |
| Source maps (development) | enabled |
| Budget warning | 4 MB (initial) |
| Budget error | 4 MB (initial), 8 MB (anyComponentStyle) |

**Figure/Table Placeholder:**  
[Insert table: Bundle analysis — chunk name, raw size, transfer size]  
[Insert figure: Lighthouse performance audit results]

---

## 10. Security Considerations

**JWT authentication:**  
- JWT tokens are stored in `localStorage` and rehydrated on application load
- `jwtInterceptor` attaches `Authorization: Bearer <token>` header to all requests except those with `skipAuth` header (login, registration)
- Token is read from `AuthService.token()` computed signal

**Route guards:**  
Not implemented. No `canActivate`, `canMatch`, or `canLoad` guards protect any route. The application relies on:
1. Backend 401 responses catching unauthorized API calls
2. `DashboardsComponent.effect()` monitoring auth role and redirecting
3. `authErrorInterceptor` navigating to `/unauthorized` on 401

This is a identified improvement priority for v2.

**XSS prevention:**  
- Angular's template syntax `{{ }}` automatically escapes HTML entities
- No `innerHTML`, `bypassSecurityTrustHtml`, or `[innerHTML]` bindings found
- PrimeNG components handle user content through safe APIs

**HTTPS:**  
All API communications use HTTPS (`https://healthsystem.runasp.net/api`). No mixed content issues.

**Input validation:**  
- Client-side: Reactive Forms validators (required, email, pattern, minLength)
- All validation is reinforced by server-side validation (assumed)

**Security measures summary:**

| Concern | Implementation | Status | Priority for v2 |
|---|---|---|---|
| JWT authentication | Bearer token via interceptor, localStorage | ✅ Implemented | — |
| Route guards | None | ❌ Missing | High |
| XSS protection | Angular built-in sanitization | ✅ Implemented | — |
| HTTPS | API URL uses https:// | ✅ Implemented | — |
| Input validation | Reactive Forms validators | ✅ Implemented | — |
| CSRF | Not configured | ❌ Missing | Medium |
| Content Security Policy | Not configured | ❌ Missing | Low |
| Role-based access | Backend-enforced, no front-end guard | ⚠️ Partial | High |

**Figure/Table Placeholder:**  
[Insert figure: JWT authentication flow — Login → Token storage → Interceptor → API → 401 handling]  
[Insert table: Security measures — concern, implementation, status, v2 priority]

---

## 11. Testing

**Manual testing:**  
- Conducted via `ng serve` development server
- Browser DevTools used for debugging network requests, component state, and responsive layouts
- No formal test cases documented

**Automated tests:**  
None exist. Project configuration explicitly skips test generation:

```json
// angular.json
"schematics": {
  "@schematics/angular:component": { "skipTests": true },
  "@schematics/angular:service": { "skipTests": true },
  "@schematics/angular:guard": { "skipTests": true },
  "@schematics/angular:interceptor": { "skipTests": true }
}
```

- No `.spec.ts` files found
- No `.cy.ts` (Cypress) or `.e2e.ts` files found
- `vitest` (^4.0.8) is listed as a devDependency but not configured for Angular
- No Karma or Jasmine configuration present
- The `ng test` command would require additional setup

**Testing status summary:**

| Type | Tool | Coverage | Status |
|---|---|---|---|
| Unit (Components) | Vitest | 0% | Not configured |
| Unit (Services) | Vitest | 0% | Not configured |
| Unit (Interceptors) | Vitest | 0% | Not configured |
| E2E | None | 0% | Not configured |
| Manual | Browser DevTools | Exploratory | Only method used |

**Recommendations for v2:**
1. Configure Vitest with Angular testing utilities for unit tests
2. Add component smoke tests for all dashboard components
3. Add service tests for `AuthService`, `DoctorService`, `PatientService`
4. Add interceptor tests for JWT attachment and error handling
5. Add E2E tests using Cypress or Playwright for critical user flows (login, registration, booking)

**Figure/Table Placeholder:**  
[Insert table: Testing status — type, tool, coverage, status, v2 priority]

---

## 12. Challenges & Solutions

### Challenge 1: Duplicate Service Files

**Problem:**  
The project contains duplicate services in parallel directories:
- `services/Auth/login.service.ts` vs `services/login.service.ts`
- `services/doctor.service.ts` vs `services/doctor/doctor.service.ts`
- `services/patient.service.ts` vs `services/Patient/patient.service.ts`
- `services/models/` interfaces duplicated in `src/models/`

This duplication arose from a mid-project refactoring where services were reorganized into subdirectories by entity (Auth, Doctor, Patient). Both old and new files remain.

**Solution:**  
Components consistently use the newer nested-service pattern (`services/Auth/`, `services/Doctor/`). The old flat-service files remain as dead code but are not imported by any active component.

**Lesson learned:**  
Establish a consistent service directory convention at project start. Use `@deprecated` JSDoc markers or explicit deletion when migrating code to prevent confusion.

---

### Challenge 2: No Route Protection

**Problem:**  
No route guards (`canActivate`, `canMatch`) protect any dashboard route. Any user can navigate to `/dashboard/doctor` even without authentication. The application relies entirely on backend 401 responses for authorization enforcement.

**Solution:**  
- `DashboardsComponent` uses `effect()` to monitor `AuthService.role()` and conditionally render content
- `AuthErrorInterceptor` catches 401 responses and navigates to `/unauthorized`
- Logout navigates to `/login`

**Lesson learned:**  
Implement `canActivate` guards with role checking for production readiness. Use `canMatch` for role-specific route trees. A pattern like this would prevent unauthorized navigation before components load:

```typescript
{
  path: 'dashboard',
  canActivate: [authGuard],
  canActivateChild: [roleGuard],
  children: [
    { path: 'doctor', canMatch: [matchRole('doctor')], component: DoctorDashboard },
    { path: 'patient', canMatch: [matchRole('patient')], component: PatientDashboard },
    { path: 'lab', canMatch: [matchRole('lab')], component: LabDashboard },
  ]
}
```

---

### Challenge 3: Egyptian Location Cascading Dropdowns

**Problem:**  
Registration and profile forms require governorate → city cascading selects. The chosen Egyptian administrative dataset (`egydata` library) requires synchronous data filtering based on governorate code.

**Solution:**  
A `valueChanges` subscription on the governorate control:
1. Resets the city selection to empty
2. Finds the selected governorate by `nameEn` match
3. Fetches cities using the governorate's internal code
4. Updates a `citiesName` signal that drives the city dropdown options

```typescript
this.governorate.valueChanges.subscribe(selected => {
  this.city.reset('');
  const gov = governorates.getAll().find(e => e.nameEn === selected);
  if (gov) {
    this.citiesName.set(cities.getAll(gov.code).map(e => e.nameEn));
  }
});
```

**Lesson learned:**  
The `egydata` package significantly simplified Egyptian location handling. The reactive subscription pattern kept the UI responsive and the signal-based option list ensured template updates were automatic.

---

### Challenge 4: Multi-Step Registration State Aggregation

**Problem:**  
Each registration flow (Doctor: 3 steps, Patient: 4 steps, Lab: 2 steps) requires each step to validate independently while the parent must aggregate all data on final submit. Steps must be isolated components for maintainability.

**Solution:**  
Each child step emits a `{value, valid}` object via Angular `output()`. The parent stores each step's data in separate `WritableSignal` instances:

```typescript
// Parent component
personaldata = signal<PersonalDataSchema>(defaultPersonalData);
contactdata = signal<ContatactDataSchema>(defaultContactData);
securitydata = signal<SecurityDataSchema>(defaultSecurityData);

// Generic update handler
updateSignal<T>(data: T, signal: WritableSignal<T>): void {
  signal.set(data);
}

// Submit aggregates all step data
submitForm() {
  const finalObject = {
    ...this.personaldata().value,
    ...this.contactdata().value,
    password: this.securitydata().value.password,
  };
  this.service.register(finalObject).subscribe(...);
}
```

**Lesson learned:**  
The generic `updateSignal<T>()` method and the `{value, valid}` schema proved reusable across all three registration types. This pattern decouples child validation from parent aggregation, making it easy to add, remove, or reorder steps.

**Figure/Table Placeholder:**  
[Insert figure: Registration data flow — Step Components → Emit {value, valid} → Parent Signals → Aggregate → API Request]

---

## 13. Chapter Summary

**Summary:**  
The Medical-Pulse front-end is built with **Angular 21 standalone components**, leveraging **Signals** as the primary reactivity model and **PrimeNG 21** for UI components styled with **Tailwind CSS 4**. The application serves three user roles (Patient, Doctor, Laboratory) through dedicated dashboards, multi-step registration flows, a doctor appointment booking system with 6-filter computed pipeline, and role-based authentication via JWT tokens.

**Key architectural decisions:**

| Decision | Choice | Rationale |
|---|---|---|
| Component architecture | Standalone (no NgModules) | Angular 21 best practice, reduced boilerplate |
| State management | Angular Signals | Built-in, fine-grained reactivity, no external dependency |
| UI framework | PrimeNG 21 | 60+ components, Tailwind integration, accessibility |
| Styling | Tailwind CSS 4 | Utility-first, consistent design tokens, responsive prefixes |
| HTTP middleware | Functional interceptors | Clean pipeline for JWT, error handling, logging |
| Layout | Shell + child routes | Role-specific dashboards with shared sidebar pattern |

**Key features implemented:**

| Feature | Status | Highlights |
|---|---|---|
| Multi-role registration | ✅ Complete | 3 steppers (2/3/4 steps), PrimeNG stepper, reactive forms |
| Doctor dashboard | ✅ Complete | 6 pages, appointments with signal filtering, schedule editor |
| Lab dashboard | ✅ Complete | 5 pages, violet theme, test management, upload/results tracking |
| Patient dashboard | ✅ Complete | 4 pages, personal info, lab results, appointments, visits |
| Appointment booking | ✅ Complete | 6-filter pipeline, availability validation, booking dialog |
| JWT authentication | ✅ Complete | Bearer token via interceptor, localStorage persistence |
| Error handling | ✅ Complete | Centralized interceptor for 400-504 status codes |
| Egyptian location data | ✅ Complete | Cascading governorate→city dropdowns via egydata package |

**Areas identified for improvement (v2):**

| Area | Current Status | Recommended Improvement |
|---|---|---|
| Route guards | ❌ Missing | `canActivate` + `canMatch` for role-based protection |
| Lazy loading | ❌ Not used | `loadComponent` for dashboard child routes |
| Testing | ❌ None | Vitest unit tests + E2E with Playwright |
| trackBy | ❌ Not used | Add `trackBy` to all `@for` loops |
| Code splitting | ❌ Not used | Route-level code splitting for dashboard pages |
| CSRF protection | ❌ Missing | Configure CSRF token handling |
| Content Security Policy | ❌ Missing | Add CSP headers |
| Duplicate services | ⚠️ Partial | Clean up legacy `services/` flat files |

**Transition to next chapter:**  
The following chapter details the back-end REST API design, database schema, server-side authentication, and the integration layer connecting this front-end to the Medical-Pulse healthcare platform backend.

**Figure/Table Placeholder:**  
[Insert figure: Architecture summary — Components → Services → Interceptors → API → Backend]  
[Insert figure: Final application screenshots — all three dashboards side by side]
