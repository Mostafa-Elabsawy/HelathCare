import { Component, SimpleChange, effect, inject, input, signal } from '@angular/core';
import {AbstractControl,FormControl,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { PatientService } from '../../../../services/Patient/patient.service';
import {defaultPatientProfil,PatientProfileResponseAPI,UpdatePatientProfileAPI,} from '../../../../services/models/patient-api.interface';
import { governorates, cities } from 'egydata';

@Component({
  selector: 'app-edit-personal-info',
  imports: [
    ImageModule,
    FileUploadModule,
    ReactiveFormsModule,
    ButtonModule,
    ChipModule,
    DatePickerModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './edit-personal-info.component.html',
  styleUrl: './edit-personal-info.component.css',
})
export class EditPersonalInfo {
  private patientService = inject(PatientService);

  patientData = input<PatientProfileResponseAPI>(defaultPatientProfil);

  editDialogVisible = signal(false);
  imagePreview = signal('placeholder1.jpg');
  profileFileName = signal<File | null>(null);

  genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  healthInsurancesCompanies = [
    { label: 'UHIA', value: 'UHIA' },
    { label: 'HIO', value: 'HIO' },
    { label: 'Doctors Syndicate', value: 'Doctors Syndicate' },
    { label: 'Engineers Syndicate', value: 'Engineers Syndicate' },
    { label: 'GlobeMed Egypt', value: 'GlobeMed Egypt' },
    { label: 'AXA Egypt', value: 'AXA Egypt' },
  ];

  newAllergy = new FormControl('', { nonNullable: true });
  newChronic = new FormControl('', { nonNullable: true });
  newSurgery = new FormControl('', { nonNullable: true });

  personalInfoForm = new FormGroup({
    firstName: new FormControl<string>(
      { value: 'Mostafa', disabled: true },
      { nonNullable: true, validators: [Validators.required] },
    ),
    middleName: new FormControl<string>(
      { value: 'Ahmed', disabled: true },
      { nonNullable: true, validators: [Validators.required] },
    ),
    lastName: new FormControl<string>(
      { value: 'Elabsawy', disabled: true },
      { nonNullable: true, validators: [Validators.required] },
    ),
    dateOfBirth: new FormControl<string>(
      { value: '', disabled: true },
      { nonNullable: true, validators: [Validators.required] },
    ),
    gender: new FormControl<string>(
      { value: 'male', disabled: true },
      { nonNullable: true, validators: [Validators.required] },
    ),
    nationalId: new FormControl<string>(
      { value: '12345678', disabled: true },
      { nonNullable: true, validators: [Validators.required, Validators.pattern('^[0-9]{8}$')] },
    ),
    email: new FormControl<string>(
      { value: '7p0yI@example.com', disabled: true },
      { nonNullable: true, validators: [Validators.required, Validators.email] },
    ),
    phone: new FormControl<string>('01557567617', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^0?1[1|2|5|0][0-9]{8}$')],
    }),
    governorate: new FormControl<string>('Menofia', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    city: new FormControl<string>('Shebin', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl<string>('St. 123, Shebin, Menofia', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bloodGroup: new FormControl<string>('A+', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    hasInsurance: new FormControl<string>('UHIA', { nonNullable: true }),
    allergies: new FormControl<string[]>(['Peanut Allergy', 'Dust Allergy'], { nonNullable: true }),
    chronic: new FormControl<string[]>(['Diabetes', 'Hypertension'], { nonNullable: true }),
    previousSurgery: new FormControl<string[]>(['Appendectomy', 'Gallbladder Removal'], {
      nonNullable: true,
    }),
  });

  valid(input: AbstractControl): boolean {
    return input.invalid && (input.touched || input.dirty);
  }

  openEditDialog(): void {
    this.editDialogVisible.set(true);
  }

  closeEditDialog(): void {
    this.editDialogVisible.set(false);
  }

  addValue(input: FormControl<string>, array: FormControl<string[]>): void {
    const value = input.getRawValue().trim();

    if (!value) return;

    array.setValue([...array.getRawValue(), value]);
    input.reset('');
    array.markAsDirty();
  }

  removeValue(index: number, array: FormControl<string[]>): void {
    array.setValue(array.getRawValue().filter((_, itemIndex) => itemIndex !== index));
    array.markAsDirty();
  }

  pressed(event: KeyboardEvent, input: FormControl<string>, array: FormControl<string[]>): void {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    this.addValue(input, array);
  }

  updateProfilePicture(event: FileUploadHandlerEvent): void {
    const file = event.files[0];

    if (!file) return;

    this.imagePreview.set(URL.createObjectURL(file));
    this.profileFileName.set(file);

    console.log('profile picture updated successfully');
  }

  saveChanges(): void {
    if (!this.personalInfoForm.valid) {
      this.personalInfoForm.markAllAsTouched();
      return;
    }

    const formValue = this.personalInfoForm.getRawValue();

    const data: UpdatePatientProfileAPI = {
      phone: formValue.phone,
      governorate: formValue.governorate,
      address: formValue.address,
      bloodGroup: formValue.bloodGroup,
      hasInsurance: formValue.hasInsurance,
      allergies: formValue.allergies,
      chronic: formValue.chronic,
      previousSurgery: formValue.previousSurgery,
      gender: formValue.gender,
      dateOfBirth: formValue.dateOfBirth,
    };

    console.log('data = ', data);

    this.patientService.updatePatientProfile(data).subscribe({
      next: (res) => console.log(res),
      error: (err) => console.log(err),
    });
    this.closeEditDialog();
  }

  ngOnChanges(changes: SimpleChange): void {
    const patient = this.patientData();

    this.personalInfoForm.patchValue({
      firstName: patient.firstName,
      middleName: patient.middleName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      nationalId: patient.nationalID.toString(),
      email: patient.email,
      phone: patient.phone,
      governorate: patient.governorate,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      hasInsurance: patient.hasInsurance,
      allergies: patient.allergies,
      chronic: patient.chronic,
      previousSurgery: patient.previousSurgery,
    });
    console.log("input changes",patient);
  }
  GovernatesNames: string[] = [];
  citiesName = signal<string[]>([]);
  constructor() {
    let AllGovernatesData = governorates.getAll();
    const default_GOV={ id: 0, code: '', name: '', nameEn: '' };
    this.GovernatesNames = AllGovernatesData.map((element: any) => element.nameEn);
    this.personalInfoForm.controls.governorate.valueChanges.subscribe((value) => {
      this.personalInfoForm.controls.city.setValue('');
      let selectedGovernateData =
        AllGovernatesData.find((element: any) => element.nameEn == value) ?? default_GOV;
      let citiesData= cities.getByGovernorate(selectedGovernateData.code);
      let allnames: string[] = citiesData.map((element: any) => element.nameEn);
      this.citiesName.set(allnames);
      // console.log(selectedGovernateData, allnames);
    });
          // console.log(selectedGovernateData, allnames);
  }
}
