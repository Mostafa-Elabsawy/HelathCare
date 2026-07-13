import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ContatactDataSchema } from '../doctor-register.interface';
import { EgyDataService } from '../../../../../services/egy-data.service';
@Component({
  selector: 'doctor-contact-info',
  imports: [
    InputGroupAddonModule,
    InputGroupModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class Contact {
  output = output<ContatactDataSchema>();
  private egyDataService = inject(EgyDataService);
  GovernatesNames = this.egyDataService.GovernatesNames;
  citiesName = signal<string[]>([]);
  valid(input: FormControl): boolean {
    return input.invalid && (input.touched || input.dirty);
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
    this.governate.valueChanges.subscribe((value) => {
      this.city.setValue('');
      this.citiesName.set(this.egyDataService.getCities(value) ?? []);
    });
    this.contactData.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      let data: ContatactDataSchema = {
        value: this.contactData.getRawValue(),
        valid: this.contactData.valid,
      };
      this.output.emit(data);
    });
  }
}
