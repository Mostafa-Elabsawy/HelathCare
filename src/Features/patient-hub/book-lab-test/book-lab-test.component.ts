import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { RouterLink } from '@angular/router';

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
}

@Component({
  selector: 'app-book-lab-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    DialogModule,
    DatePickerModule,
    RouterLink
  ],
  templateUrl: './book-lab-test.component.html',
  styleUrl: './book-lab-test.component.css',
})
export class BookLabTestComponent implements OnInit {
  labs = signal<Lab[]>([]);
  searchQuery = signal<string>('');
  selectedTestCategory = signal<string | null>(null);
  selectedCity = signal<string | null>(null);
  sortBy = signal<string>('rating');

  displayBookingDialog = signal<boolean>(false);
  selectedLabForBooking = signal<Lab | null>(null);
  bookingSuccess = signal<boolean>(false);

  bookingForm = new FormGroup({
    testDate: new FormControl<Date | null>(null, [Validators.required]),
    testTime: new FormControl<string>('', [Validators.required]),
    patientName: new FormControl('', [Validators.required]),
    patientPhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
    selectedTest: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  testCategories = [
    { label: 'All Tests', value: null },
    { label: 'Blood Tests', value: 'Blood Tests' },
    { label: 'Urine Analysis', value: 'Urine Analysis' },
    { label: 'Radiology & Imaging', value: 'Radiology & Imaging' },
    { label: 'Hormone Profile', value: 'Hormone Profile' },
    { label: 'Allergy Testing', value: 'Allergy Testing' },
    { label: 'Genetic Screening', value: 'Genetic Screening' },
    { label: 'Microbiology', value: 'Microbiology' },
  ];

  cities = [
    { label: 'All Cities', value: null },
    { label: 'Cairo', value: 'Cairo' },
    { label: 'Giza', value: 'Giza' },
    { label: 'Alexandria', value: 'Alexandria' },
  ];

  sortOptions = [
    { label: 'Top Rated', value: 'rating' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
  ];

  availableTimeSlots: string[] = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  ];

  ngOnInit() {
    this.labs.set([
      {
        id: 1, name: 'Al-Borg Laboratories', city: 'Maadi', governorate: 'Cairo',
        testsCount: 250, openingTime: '08:00 AM', closingTime: '11:00 PM',
        basePrice: 180, rating: 4.8, reviewsCount: 312,
        about: 'State-of-the-art diagnostic center offering comprehensive blood work, imaging, and specialized testing with rapid digital reporting.',
        testCategories: ['Blood Tests', 'Radiology & Imaging', 'Hormone Profile'],
      },
      {
        id: 2, name: 'Alfa Laboratories', city: 'Dokki', governorate: 'Giza',
        testsCount: 195, openingTime: '09:00 AM', closingTime: '10:00 PM',
        basePrice: 150, rating: 4.7, reviewsCount: 256,
        about: 'Accredited lab network known for precision in clinical chemistry, microbiology, and endocrine profiling.',
        testCategories: ['Blood Tests', 'Microbiology', 'Allergy Testing'],
      },
      {
        id: 3, name: 'Al-Mokhtabar Labs', city: 'Smouha', governorate: 'Alexandria',
        testsCount: 310, openingTime: '08:00 AM', closingTime: '11:00 PM',
        basePrice: 200, rating: 4.9, reviewsCount: 428,
        about: 'Premier reference laboratory with advanced genetic screening and molecular diagnostics capabilities.',
        testCategories: ['Genetic Screening', 'Hormone Profile', 'Blood Tests'],
      },
      {
        id: 4, name: 'Speed Lab', city: 'Nasr City', governorate: 'Cairo',
        testsCount: 140, openingTime: '10:00 AM', closingTime: '09:00 PM',
        basePrice: 120, rating: 4.5, reviewsCount: 189,
        about: 'Quick-turnaround diagnostic service specializing in routine checkups, urine analysis, and rapid result delivery.',
        testCategories: ['Urine Analysis', 'Blood Tests', 'Allergy Testing'],
      },
      {
        id: 5, name: 'PathCare Egypt', city: 'Zamalek', governorate: 'Cairo',
        testsCount: 280, openingTime: '07:00 AM', closingTime: '10:00 PM',
        basePrice: 220, rating: 4.8, reviewsCount: 367,
        about: 'Multi-disciplinary lab offering high-complexity testing in oncology, immunology, and infectious diseases.',
        testCategories: ['Microbiology', 'Hormone Profile', 'Genetic Screening'],
      },
      {
        id: 6, name: 'ClearView Diagnostics', city: '6th of October', governorate: 'Giza',
        testsCount: 170, openingTime: '08:00 AM', closingTime: '08:00 PM',
        basePrice: 160, rating: 4.6, reviewsCount: 145,
        about: 'Modern diagnostic facility with a focus on radiology imaging, ultrasound, and preventive health screening packages.',
        testCategories: ['Radiology & Imaging', 'Blood Tests', 'Urine Analysis'],
      },
    ]);
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

    const sort = this.sortBy();
    list = [...list];
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'priceAsc') list.sort((a, b) => a.basePrice - b.basePrice);
    else if (sort === 'priceDesc') list.sort((a, b) => b.basePrice - a.basePrice);

    return list;
  });

  openBookingDialog(lab: Lab) {
    this.selectedLabForBooking.set(lab);
    this.bookingSuccess.set(false);
    this.bookingForm.patchValue({
      testDate: null,
      testTime: '',
      patientName: 'Mostafa Elabsawy',
      patientPhone: '01012345678',
      selectedTest: '',
      notes: '',
    });
    this.bookingForm.markAsPristine();
    this.bookingForm.markAsUntouched();
    this.displayBookingDialog.set(true);
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      const formVal = this.bookingForm.value;
      const lab = this.selectedLabForBooking();
      console.log('--- LAB TEST BOOKED ---');
      console.log('Lab:', lab?.name);
      console.log('Test:', formVal.selectedTest);
      console.log('Date:', formVal.testDate);
      console.log('Time:', formVal.testTime);
      console.log('Patient:', formVal.patientName);
      console.log('Phone:', formVal.patientPhone);
      console.log('Notes:', formVal.notes);

      this.bookingSuccess.set(true);
      setTimeout(() => {
        this.displayBookingDialog.set(false);
        this.bookingSuccess.set(false);
      }, 2500);
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.bookingForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
