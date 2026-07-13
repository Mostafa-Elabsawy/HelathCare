import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../services/ai.service';
import { AiRepsonse } from '../../../models/ait.interface';

type AnalysisStatus = 'healthy' | 'unhealthy';

interface AnalysisResult {
    status: AnalysisStatus;
    diagnosis: string;
    comment: string;
    confidence: number;
    fileName: string;
}

@Component({
    selector: 'app-ai-lab-analysis',
    imports: [ButtonModule, SelectModule, CommonModule, FormsModule],
    templateUrl: './ai-lab-analysis.component.html',
    styleUrl: './ai-lab-analysis.component.css',
})
export class AiLabAnalysisComponent {
    private aiService = inject(AiService);

    isDragOver = signal(false);
    isAnalyzing = signal(false);
    result = signal<AnalysisResult | null>(null);
    error = signal<string | null>(null);
    testType = signal<'cbc' | 'diabetes'>('cbc');

    testTypeOptions = [
        { label: 'CBC Analysis', value: 'cbc' },
        { label: 'Diabetes Analysis', value: 'diabetes' },
    ];

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);

        const file = event.dataTransfer?.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            this.handleFile(file);
        }
        input.value = '';
    }

    triggerFileInput(fileInput: HTMLInputElement): void {
        fileInput.click();
    }

    resetAnalysis(): void {
        this.result.set(null);
        this.error.set(null);
    }

    private handleFile(file: File): void {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const maxSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PDF, JPG, or PNG file.');
            return;
        }

        if (file.size > maxSize) {
            alert('File size exceeds the 10 MB limit.');
            return;
        }

        this.isAnalyzing.set(true);
        this.error.set(null);

        const request$ = this.testType() === 'cbc'
            ? this.aiService.checkCBC(file)
            : this.aiService.checkDiabeties(file);

        request$.subscribe({
            next: (apiResult: AiRepsonse) => {
                this.result.set({
                    status: apiResult.diagnosis === 'Healthy' ? 'healthy' : 'unhealthy',
                    diagnosis: apiResult.diagnosis,
                    comment: apiResult.comment,
                    confidence: apiResult.confidence,
                    fileName: file.name,
                });
                this.isAnalyzing.set(false);
            },
            error: (err) => {
                this.error.set(err?.error?.message ?? err?.message ?? 'Analysis failed. Please try again.');
                this.isAnalyzing.set(false);
            },
        });
    }
}
