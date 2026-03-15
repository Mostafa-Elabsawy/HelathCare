import { Component,  output,  } from '@angular/core';
import {  FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import {InputText} from 'primeng/inputtext';
import { Select } from "primeng/select";
import { SelectModule } from 'primeng/select';
import { Insurace_providers, MedicalDataSchema } from '../interface';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'patient-medical-info',
  imports: [
    SelectModule,
    ReactiveFormsModule,
    ChipModule,
    FormsModule,
    InputText,
    ButtonDirective,
    Select,
  ],
  templateUrl: './medical.html',
  styleUrl: './medical.css',
})
export class Medical {
  output = output<MedicalDataSchema>();
  BloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  healthInsurancesCompanies = Insurace_providers;
  newAllergy = new FormControl('');
  newChronic = new FormControl('');
  newSurgery = new FormControl('');

  chronicDiseasesArray = new FormControl<string[]>([], { nonNullable: true });
  previousSurgeryArray = new FormControl<string[]>([], { nonNullable: true });
  allergiesArray = new FormControl<string[]>([], { nonNullable: true });

  BloodGroup = new FormControl<string>('', { nonNullable: true });
  healthInsurance = new FormControl<string>('', { nonNullable: true });

  medicalData = new FormGroup({
    allergies: this.allergiesArray,
    chronic: this.chronicDiseasesArray,
    previousSurgery: this.previousSurgeryArray,
    bloodGroup: this.BloodGroup,
    hasInsurance: this.healthInsurance,
  });
  valid(input: FormControl): boolean {
    return input.invalid && input.touched;
  }
  constructor() {
    this.medicalData.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      let data: MedicalDataSchema = {
        value: this.medicalData.getRawValue(),
        valid: this.medicalData.valid,
      }
      this.output.emit(data);
    });

    //console.log(data);
  }
  addValue(input: FormControl, array: FormControl) {
    if (!input.getRawValue() ) return;
    array.setValue([...array.getRawValue(), input.getRawValue()]);
    input.reset();
  }
  removeValue(index: number, array: FormControl) {
    array.value.splice(index, 1);
    array.setValue(array.value);
  }
  pressed(event: KeyboardEvent) {
    if(event.key !== 'Enter') return;
    let input = event.target as HTMLInputElement;
    let button = input.nextElementSibling as HTMLButtonElement;
    button.click();
  }
}
