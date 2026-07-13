import { Component, computed, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { LabService } from '../../../../services/lab.service';
import { formatDate } from '../../../../utils/date-format';

interface PendingTest {
    id: number;
    testId: string;
    patientName: string;
    patientId: number;
    testName: string;
    date: string;
    testDate: string;
    orderedBy: string;
}

interface RecentUpload {
    id: number;
    testId: string;
    patientName: string;
    testName: string;
    date: string;
    type: 'vial' | 'droplet' | 'flask';
}

@Component({
    selector: 'app-lab-upload',
    imports: [ButtonModule, Dialog, DatePipe, ToastModule],
    providers: [MessageService],
    templateUrl: './upload.component.html',
})
export class LabUpload {
    private labService = inject(LabService);
    private msg = new MessageService();

    readonly pendingTests = computed<PendingTest[]>(() =>
        this.labService.appointments()
            .filter((a) => a.status === 'Approved')
            .map((a) => ({
                id: a.id,
                testId: `LAB-${String(a.id).padStart(3, '0')}`,
                patientName: `${a.firstName} ${a.lastName}`,
                patientId: a.patientId,
                testName: a.testName ?? '',
                date: formatDate(a.date),
                testDate: a.date,
                orderedBy: '',
            })),
    );

    recentUploads = signal<RecentUpload[]>([]);

    newUploadDialogVisible = signal(false);
    selectedTest = signal<PendingTest | null>(null);
    selectedFile = signal<File | null>(null);
    selectedFileName = signal('');
    uploadSuccess = signal(false);

    openUploadDialog(): void {
        this.selectedTest.set(null);
        this.selectedFile.set(null);
        this.selectedFileName.set('');
        this.uploadSuccess.set(false);
        this.newUploadDialogVisible.set(true);
    }

    selectTest(test: PendingTest): void {
        this.selectedTest.set(test);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.length) {
            this.selectedFile.set(input.files[0]);
            this.selectedFileName.set(input.files[0].name);
        }
    }

    confirmUpload(): void {
        const test = this.selectedTest();
        const file = this.selectedFile();
        if (!test || !file) return;

        this.labService.uploadResult(file, test.patientId).subscribe({
            next: () => {
                const icons: ('vial' | 'droplet' | 'flask')[] = ['vial', 'droplet', 'flask'];
                const upload: RecentUpload = {
                    id: Date.now(),
                    testId: test.testId,
                    patientName: test.patientName,
                    testName: test.testName,
                    date: 'Just now',
                    type: icons[Math.floor(Math.random() * icons.length)],
                };
                this.recentUploads.update((list) => [upload, ...list]);
                this.uploadSuccess.set(true);
                this.selectedTest.set(null);
                this.msg.add({ severity: 'success', summary: 'Uploaded', detail: `${test.testName} result for ${test.patientName} uploaded successfully.` });
                setTimeout(() => this.newUploadDialogVisible.set(false), 800);
            },
        });
    }

    downloadResult(upload: RecentUpload): void {
        this.msg.add({ severity: 'info', summary: 'Download', detail: `Downloading ${upload.testName} result...` });
    }
}
