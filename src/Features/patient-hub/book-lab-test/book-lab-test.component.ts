import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { LabService } from '../../../services/lab.service';

export interface Lab {
  id: number;
  name: string;
  city: string;
  governorate: string;
  testsCount: number;
  openingTime: string;
  closingTime: string;
  basePrice: number;
  rating: number;
  reviewsCount: number;
  about: string;
  testCategories: string[];
  picture: string | null;
}

@Component({
  selector: 'app-book-lab-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    RouterLink
  ],
  templateUrl: './book-lab-test.component.html',
  styleUrl: './book-lab-test.component.css',
})
export class BookLabTestComponent implements OnInit {
  private labService = inject(LabService);

  labs = signal<Lab[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal<string>('');
  selectedTestCategory = signal<string | null>(null);
  selectedCity = signal<string | null>(null);

  testCategories = computed(() => {
    const unique = [...new Set(this.labs().flatMap(l => l.testCategories).filter(Boolean))];
    return [{ label: 'All Tests', value: null }, ...unique.map(c => ({ label: c, value: c }))];
  });

  cities = computed(() => {
    const unique = [...new Set(this.labs().map(l => l.city).filter(Boolean))];
    return [{ label: 'All Cities', value: null }, ...unique.map(c => ({ label: c, value: c }))];
  });

  ngOnInit() {
    this.loadLabs();
  }

  loadLabs() {
    this.loading.set(true);
    this.error.set(null);
    this.labService.getAllLabs().subscribe({
      next: (apiLabs) => {
        this.labs.set(apiLabs.map((l: any) => this.mapApiLab(l)));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load labs. Please try again.');
        this.loading.set(false);
      },
    });
  }

  private mapApiLab(api: any): Lab {
    const tests = api.labTests ?? [];
    const categories = tests.map((t: any) => t.testName).filter(Boolean);
    const prices = tests.map((t: any) => t.price).filter((p: any) => p != null);
    return {
      id: api.id,
      name: api.name || 'Unknown Lab',
      city: api.city || 'Unknown',
      governorate: api.governorate || 'Unknown',
      testsCount: tests.length || 10,
      openingTime: api.workingHourStart || '08:00',
      closingTime: api.workingHourEnd || '20:00',
      basePrice: prices.length ? Math.min(...prices) : 200,
      rating: 4.5,
      reviewsCount: 0,
      about: '',
      testCategories: categories.length ? categories : ['General Checkup', 'Blood Tests'],
      picture: api.picture ?? null,
    };
  }

  filteredLabs = computed(() => {
    let list = this.labs();

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(lab =>
        lab.name.toLowerCase().includes(query) ||
        lab.city.toLowerCase().includes(query) ||
        lab.governorate.toLowerCase().includes(query) ||
        lab.testCategories.some(c => c.toLowerCase().includes(query))
      );
    }

    const category = this.selectedTestCategory();
    if (category) {
      list = list.filter(lab => lab.testCategories.includes(category));
    }

    const city = this.selectedCity();
    if (city) {
      list = list.filter(lab => lab.city === city || lab.governorate === city);
    }

    return list;
  });
}
