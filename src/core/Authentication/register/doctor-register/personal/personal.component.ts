import { Component, input, OnInit, output, signal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PersonalDataSchema,DoctorSpecialties } from '../doctor-register.interface'
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
@Component({
  selector: 'doctor-personal-info',
  imports: [
    InputNumberModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    TextareaModule,
  ],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css',
})
export class Personal {
  output = output<PersonalDataSchema>();
  Levels = ['General Practitioner (GP)', 'Specialist', 'Consultant'];
  Specialties: string[] = DoctorSpecialties;
  firstName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  lastName = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  gender = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  specialty = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  medicalLevel = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });
  nationalId = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^[0-9]{8}$')],
  });

  personalData = new FormGroup({
    firstName: this.firstName,
    lastName: this.lastName,
    gender: this.gender,
    nationalID: this.nationalId,
    specialty: this.specialty,
    medicalLevel: this.medicalLevel,
  });

  valid(input: FormControl): boolean {
    return input.invalid && (input.touched || input.dirty);
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
      this.output.emit(data);
      // console.log(data);
    });
  }
}
