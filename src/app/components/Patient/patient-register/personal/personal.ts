import { Component, input, OnInit, output, signal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PersonalDataSchema } from '../interface'
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'patient-personal-info',
  imports: [
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './personal.html',
  styleUrl: './personal.css',
})
export class Personal {
  output = output<PersonalDataSchema>();
  firstName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  middleName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  lastName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  dateOfBirth = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  gender = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  nationalId = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^[0-9]{14}$')],
  });

  personalData = new FormGroup({
    firstName: this.firstName,
    middleName: this.middleName,
    lastName: this.lastName,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    nationalID: this.nationalId,
  });

  valid(input: FormControl): boolean {
    return input.invalid && input.touched;
  }

  genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
  constructor() {
    this.personalData.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      let data: PersonalDataSchema = {
        value: this.personalData.getRawValue(),
        valid: this.personalData.valid,
      };
      data.value.dateOfBirth = this.formatDate(data.value.dateOfBirth);
      this.output.emit(data);
      // console.log(data);
    });
  }
  formatDate(currentdate: string): string
  {
    const date = new Date(currentdate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  }
}
