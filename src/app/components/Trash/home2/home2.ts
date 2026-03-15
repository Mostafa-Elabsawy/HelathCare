import { Component, signal } from '@angular/core';
import { MenuItem } from 'primeng/api'; // لو استخدمت أي من الـ menus
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { FormsModule } from '@angular/forms'; // for ngModel
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { TextareaModule } from 'primeng/textarea';
import { StepperModule } from 'primeng/stepper';

@Component({
  selector: 'app-home2',
  templateUrl: './home2.html',
  imports: [
    StepperModule,
    TextareaModule,
    PasswordModule,
    InputNumberModule,
    ChipModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    DatePickerModule,
    FormsModule,
  ],
  styleUrls: ['./home2.css'],
})
export class Home2 {
  // Dropdown options
  genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
  egyptGovernorates = [
    { value: 'cairo', label: 'Cairo' },
    { value: 'giza', label: 'Giza' },
    { value: 'alexandria', label: 'Alexandria' },
    { value: 'dakahlia', label: 'Dakahlia' },
    { value: 'sharqia', label: 'Sharqia' },
    { value: 'qalyubia', label: 'Qalyubia' },
    { value: 'kafr_el_sheikh', label: 'Kafr El Sheikh' },
    { value: 'gharbia', label: 'Gharbia' },
    { value: 'monufia', label: 'Monufia' },
    { value: 'beheira', label: 'Beheira' },
    { value: 'damietta', label: 'Damietta' },
    { value: 'port_said', label: 'Port Said' },
    { value: 'suez', label: 'Suez' },
    { value: 'ismailia', label: 'Ismailia' },
    { value: 'beni_suef', label: 'Beni Suef' },
    { value: 'fayyoum', label: 'Fayyoum' },
    { value: 'minya', label: 'Minya' },
    { value: 'asyut', label: 'Asyut' },
    { value: 'sohag', label: 'Sohag' },
    { value: 'qena', label: 'Qena' },
    { value: 'luxor', label: 'Luxor' },
    { value: 'aswan', label: 'Aswan' },
    { value: 'red_sea', label: 'Red Sea' },
    { value: 'new_valley', label: 'New Valley' },
    { value: 'matrouh', label: 'Matrouh' },
    { value: 'north_sinai', label: 'North Sinai' },
    { value: 'south_sinai', label: 'South Sinai' },
  ];

  Insurace_providers = [
    { label: 'UHIA', value: 'UHIA' },
    { label: 'HIO', value: 'HIO' },
    { label: 'Doctors Syndicate', value: 'Doctors Syndicate' },
    { label: 'Engineers Syndicate', value: 'Engineers Syndicate' },
    { label: 'GlobeMed Egypt', value: 'GlobeMed Egypt' },
    { label: 'AXA Egypt', value: 'AXA Egypt' },
  ];

  // Allergies, diseases, surgeries arrays
  allergies = signal<string[]>(['Penicillin', 'Pollen', 'Peanuts']);
  chronicDiseases: string[] = ['Diabetes', 'Hypertension', 'Asthma'];
  previousSurgeries: string[] = ['Appendectomy', 'Gallbladder Removal', 'Knee Arthroscopy'];

  // New input values
  newAllergy = '';
  newDisease = '';
  newSurgery = '';

  // Methods to add/remove items
  addAllergy() {
    if (this.newAllergy)
      this.allergies.update((x) => {
        x.push(this.newAllergy);
        return x;
      });
    this.newAllergy = '';
  }
  removeAllergy(a: string | undefined) {
    console.log(a);
    console.log(this.allergies());
    this.allergies.update((x) => x.filter((y) => y !== a));
    console.log(this.allergies());
  }

  addDisease() {
    if (this.newDisease) this.chronicDiseases.push(this.newDisease);
    this.newDisease = '';
  }
  removeDisease(d: string) {
    this.chronicDiseases = this.chronicDiseases.filter((x) => x !== d);
  }

  addSurgery() {
    if (this.newSurgery) this.previousSurgeries.push(this.newSurgery);
    this.newSurgery = '';
  }
  removeSurgery(s: string) {
    this.previousSurgeries = this.previousSurgeries.filter((x) => x !== s);
  }
}
