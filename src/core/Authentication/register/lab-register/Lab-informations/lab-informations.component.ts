import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { LabInformationsSchema } from '../lab-register.interface';
import { EgyDataService } from '../../../../../services/egy-data.service';
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
  private egyDataService = inject(EgyDataService);
  GovernatesNames = this.egyDataService.GovernatesNames;
  citiesName = signal<string[]>([]);
  valid(input: FormControl): boolean {
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
    this.governate.valueChanges.subscribe((value) => {
      this.city.setValue('');
      this.citiesName.set(this.egyDataService.getCities(value) ?? []);
    });
    this.labData.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      let data: LabInformationsSchema = {
        value: this.labData.getRawValue(),
        valid: this.labData.valid,
      };
      this.output.emit(data);
    });
  }
}
