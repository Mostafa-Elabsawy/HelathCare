import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, elementAt } from 'rxjs';
import { LabInformationsSchema, GOV, default_GOV, CTY } from '../lab-register.interface';
import { governorates, cities } from 'egydata';
@Component({
  selector: 'app-lab-informations',
  imports: [
    InputGroupAddonModule,
    InputGroupModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lab-informations.component.html',
  styleUrl: './lab-informations.component.css',
})
export class LabInformationsComponent {
  output = output<LabInformationsSchema>();
  GovernatesNames: string[] = [];
  citiesName = signal<string[]>([]);
  valid(input: FormControl): boolean {
    console.log(input.invalid && (input.touched || input.dirty));
    return input.invalid && (input.touched || input.dirty);
  }
  labName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
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
  labData = new FormGroup({
    email: this.email,
    phone: this.phone,
    governorate: this.governate,
    city: this.city,
    address: this.address,
    name: this.labName,
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
    this.labData.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      let data: LabInformationsSchema = {
        value: this.labData.getRawValue(),
        valid: this.labData.valid,
      };
      // console.log(data);

      this.output.emit(data);
    });
    // this.egyptGovernates=governorates.map(element => {

    // });
  }
}
