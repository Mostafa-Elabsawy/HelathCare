import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

type AnalysisStatus = 'healthy' | 'unhealthy';

interface AnalysisResult {
    status: AnalysisStatus;
    comment: string;
    fileName: string;
}

@Component({
    selector: 'app-ai-lab-analysis',
    imports: [ButtonModule, CommonModule],
    templateUrl: './ai-lab-analysis.component.html',
    styleUrl: './ai-lab-analysis.component.css',
})
export class AiLabAnalysisComponent {
    isDragOver = signal(false);
    isAnalyzing = signal(false);
    result = signal<AnalysisResult | null>(null);

    private readonly healthyComments = [
        'Your laboratory results are within normal ranges. All measured values appear normal. Maintain your current healthy lifestyle and follow up with your annual checkup.',
        'All tested markers are in the optimal range. Your blood work, lipid profile, and organ function indicators show excellent health. Keep up your wellness routine!',
        'Great news! Your report shows no abnormalities. Every parameter falls within the expected healthy range. Continue your regular health maintenance schedule.',
        'Your results are perfectly balanced. From complete blood count to metabolic panel, everything looks great. A clean bill of health!',
    ];

    private readonly unhealthyComments = [
        'Some values in your report fall outside the normal range. We recommend consulting your healthcare provider for a thorough evaluation of these results.',
        'A few markers show elevated levels that may require medical attention. Please share this report with your doctor for proper interpretation and guidance.',
        'Our analysis detected several values偏离 the reference ranges. It is advisable to review these findings with a healthcare professional who can recommend next steps.',
        'Certain parameters in your lab report require clinical correlation. Please schedule a consultation with your physician to discuss these results in detail.',
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

        const status: AnalysisStatus = Math.random() < 0.5 ? 'healthy' : 'unhealthy';
        const pool = status === 'healthy' ? this.healthyComments : this.unhealthyComments;
        const comment = pool[Math.floor(Math.random() * pool.length)];

        setTimeout(() => {
            this.result.set({ status, comment, fileName: file.name });
            this.isAnalyzing.set(false);
        }, 2500);
    }
}
