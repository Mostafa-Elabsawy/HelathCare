# Add Test Management to Lab Schedule

## Goal
Extend the lab dashboard Schedule component to allow the lab to view, add, and delete tests (name, details, Price).

## Changes

### 1. `schedule.interface.ts`
Add `LabTestItem` interface:
```typescript
export interface LabTestItem {
    name: string;
    details: string;
    Price: string;
}
```

### 2. `schedule.component.ts`
- Import `InputTextModule` + `InputTextareaModule`
- Add `tests = signal<LabTestItem[]>([...])` with sample data
- Add `addTestDialogVisible = signal(false)`
- Add form model: `newTestName`, `newTestDetails`, `newTestPrice`
- Methods: `openAddTestDialog()`, `addTest()`, `deleteTest(index: number)`

### 3. `schedule.component.html`
- Add "Tests Catalog" section below Schedule Preview with a grid of test cards
- Each card: name, details, Price, red delete button
- "+ Add Test" button next to "Edit Schedule" button in header
- Add dialog with name (text), details (textarea), Price (text) + Save/Cancel
