# Add Toast Notifications to Auth Components

## Overview
Add PrimeNG Toast notifications to all 4 auth entry components (Patient Register, Doctor Register, Lab Register, Login) so users see success/error feedback instead of silent console.log.

## Changes

### 1. Patient Register
**File:** `src/core/Authentication/register/patient-register/main/patient-register.component.ts`
- Import `ToastModule` from `primeng/toast` and `MessageService` from `primeng/api`
- Add `ToastModule` to `imports` array
- Add `MessageService` to `providers: [PatientService, MessageService]`
- Inject `messageService = inject(MessageService)`
- Replace `console.log(res)` with success toast
- Replace `console.log(err)` with error toast

**File:** `src/core/Authentication/register/patient-register/main/patient-register.component.html`
- Add `<p-toast />` as first child inside the root `<div class="min-h-screen...">`

### 2. Doctor Register
**File:** `src/core/Authentication/register/doctor-register/main/doctor-register.component.ts`
- Import `ToastModule` + `MessageService`
- Add `ToastModule` to `imports`
- Add `providers: [MessageService]`
- Inject `messageService`
- Replace console.log in next/error with toasts

**File:** `src/core/Authentication/register/doctor-register/main/doctor-register.component.html`
- Add `<p-toast />` at top

### 3. Lab Register
**File:** `src/core/Authentication/register/lab-register/main/lab-register.component.ts`
- Import `ToastModule` + `MessageService`
- Add `ToastModule` to `imports`
- Add `MessageService` to `providers: [BreakpointService, MessageService]`
- Inject `messageService`
- Replace console.log with toasts

**File:** `src/core/Authentication/register/lab-register/main/lab-register.component.html`
- Add `<p-toast />` at top

### 4. Login
**File:** `src/core/Authentication/login/login.component.ts`
- Import `ToastModule` + `MessageService`
- Add `ToastModule` to `imports`
- Add `providers: [MessageService]`
- Inject `messageService`
- Add success toast before `router.navigate()`
- Replace `console.log(err)` with error toast

**File:** `src/core/Authentication/login/login.component.html`
- Add `<p-toast />` at top

### Toast Messages
| Component | Scenario | severity | summary | detail |
|-----------|----------|----------|---------|--------|
| Register | Success | `success` | `'Success'` | `'Registration successful! Redirecting...'` |
| Register | Error | `error` | `'Error'` | `err.error?.message \|\| 'Registration failed'` |
| Login | Success | `success` | `'Welcome'` | `'Login successful!'` |
| Login | Error | `error` | `'Login Failed'` | `err.error?.message \|\| 'Invalid credentials'` |
