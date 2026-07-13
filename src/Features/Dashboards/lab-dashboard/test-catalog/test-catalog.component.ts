import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Textarea } from 'primeng/textarea';
import { LabService } from '../../../../services/lab.service';
import { LabTest } from '../../../../models/lab-api.interface';

@Component({
    selector: 'app-test-catalog',
    imports: [Textarea, FormsModule, ButtonModule, InputTextModule, Dialog, ToastModule],
    providers: [MessageService],
    templateUrl: './test-catalog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestCatalog {
    private labService = inject(LabService);
    private msg = new MessageService();

    tests = this.labService.tests;

    addTestDialogVisible = signal(false);
    editingIndex = signal<number | null>(null);

    newTestName = '';
    newTestDetails = '';
    newTestPrice = '';

    openAddTestDialog(): void {
        this.editingIndex.set(null);
        this.newTestName = '';
        this.newTestDetails = '';
        this.newTestPrice = '';
        this.addTestDialogVisible.set(true);
    }

    openEditDialog(index: number): void {
        this.editingIndex.set(index);
        const test = this.tests()[index];
        this.newTestName = test.testName;
        this.newTestDetails = test.testDetails;
        this.newTestPrice = String(test.price);
        this.addTestDialogVisible.set(true);
    }

    saveTest(): void {
        if (!this.newTestName.trim() || !this.newTestPrice.trim()) return;
        const item: LabTest = {
            testName: this.newTestName.trim(),
            testDetails: this.newTestDetails.trim(),
            price: Number(this.newTestPrice.trim()),
        };
        const current = [...this.tests()];
        const idx = this.editingIndex();
        if (idx !== null) {
            current[idx] = item;
        } else {
            current.push(item);
        }
        this.labService.updateTests({ tests: current }).subscribe({
            next: () => {
                this.addTestDialogVisible.set(false);
                this.msg.add({ severity: 'success', summary: 'Saved', detail: 'Test catalog updated.' });
            },
        });
    }

    deleteTest(index: number): void {
        const current = this.tests().filter((_, i) => i !== index);
        this.labService.updateTests({ tests: current }).subscribe({
            next: () => {
                this.msg.add({ severity: 'success', summary: 'Deleted', detail: 'Test removed from catalog.' });
            },
        });
    }
}
