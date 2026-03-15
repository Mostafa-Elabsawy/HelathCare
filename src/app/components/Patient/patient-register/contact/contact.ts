import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, elementAt } from 'rxjs';
import { ContatactDataSchema, Insurace_providers, GOV, default_GOV, CTY } from '../interface';
import { governorates, cities } from 'egydata';
@Component({
  selector: 'patient-contact-info',
  imports: [
    InputGroupAddonModule,
    InputGroupModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  output = output<ContatactDataSchema>();
  GovernatesNames: string[] = [];
  citiesName = signal<string[]>([]);
  healthInsurances = Insurace_providers;
  valid(input: FormControl): boolean {
    return input.invalid && input.touched;
  }
  governate = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  phone = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^0?1[1|2|5|0][0-9]{8}$')],
  });
  city = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  address = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  contactData = new FormGroup({
    email: this.email,
    phone: this.phone,
    governorate: this.governate,
    city: this.city,
    address: this.address,
  });
  constructor() {
    let AllGovernatesData: GOV[] = governorates.getAll();
    this.GovernatesNames = AllGovernatesData.map((element: any) => element.nameEn);
    this.governate.valueChanges.subscribe((value) => {
      this.city.setValue('');
      let selectedGovernateData: GOV =
        AllGovernatesData.find((element: any) => element.nameEn == value) ?? default_GOV;
      let citiesData: CTY[] | [] = cities.getByGovernorate(selectedGovernateData.code);
      let allnames: string[] = citiesData.map((element: any) => element.nameEn);
      this.citiesName.set(allnames);
      console.log(selectedGovernateData, allnames);
    });
    this.contactData.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      let data: ContatactDataSchema = {
        value: this.contactData.getRawValue(),
        valid: this.contactData.valid,
      };
      // console.log(data);

      this.output.emit(data);
    });
    // this.egyptGovernates=governorates.map(element => {

    // });
  }
}
