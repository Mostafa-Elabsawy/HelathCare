import { Component, inject, input, signal, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import {DoctorSpecialties }  from '../../../../core/Authentication/register/doctor-register/doctor-register.interface'

import {
  DoctorProfileResponseAPI,
  UpdateDoctorProfileAPI,
  defaultDoctorProfile,
} from '../../../../services/models/doctor-api.interface';
import { governorates, cities } from 'egydata';

import { DoctorService } from '../../../../services/doctor.service';

@Component({
  selector: 'app-edit-doctor-info',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    InputGroupModule,
    InputGroupAddonModule,
    FileUploadModule,
    ImageModule,
  ],
  templateUrl: './edit-doctor-info.component.html',
  styleUrl: './edit-doctor-info.component.css',
})
export class EditDoctorInfoComponent {
  doctorData = input<DoctorProfileResponseAPI>(defaultDoctorProfile);

  editDialogVisible = signal(false);
  imagePreview = signal<string>('placeholder1.jpg');
  profileFileName = signal<File | null>(null);

  doctorService = inject(DoctorService);

  genders = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  specialties = DoctorSpecialties;
  medicalLevels = ['General Practitioner (GP)', 'Specialist', 'Consultant'];
  doctorInfoForm = new FormGroup({
    firstName: new FormControl<string>(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),

    lastName: new FormControl<string>(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),

    nationalId: new FormControl<string>(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^[0-9]{14}$')],
      },
    ),

    gender: new FormControl<string>(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required],
      },
    ),

    email: new FormControl<string>(
      { value: '', disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      },
    ),

    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^0?1[0125][0-9]{8}$')],
    }),

    governorate: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    city: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    address: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    specialty: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    medicalLevel: new FormControl<string | null>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  valid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  openEditDialog() {
    this.editDialogVisible.set(true);
  }

  closeEditDialog() {
    this.editDialogVisible.set(false);
  }

  updateProfilePicture(event: FileUploadHandlerEvent) {
    const file = event.files[0];

    if (!file) return;

    this.profileFileName.set(file);

    const imageUrl = URL.createObjectURL(file);
    this.imagePreview.set(imageUrl);
  }

  saveChanges() {
    if (!this.doctorInfoForm.valid) {
      this.doctorInfoForm.markAllAsTouched();
      return;
    }

    const data: UpdateDoctorProfileAPI = {
      phone: this.doctorInfoForm.getRawValue().phone,
      governorate: this.doctorInfoForm.getRawValue().governorate,
      address: this.doctorInfoForm.getRawValue().address,
      gender: this.doctorInfoForm.getRawValue().gender,
      specialty: this.doctorInfoForm.getRawValue().specialty,
      medicalLevel: this.doctorInfoForm.getRawValue().medicalLevel,
    };

    console.log(data);

    this.doctorService.updateDoctorProfile(data).subscribe({
      next: (res) => {
        console.log(res);
        this.closeEditDialog();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.doctorInfoForm.patchValue({
      firstName: this.doctorData().firstName,
      lastName: this.doctorData().lastName,

      nationalId: this.doctorData().nationalID.toString(),

      gender: this.doctorData().gender,

      email: this.doctorData().email,
      phone: this.doctorData().phone,

      governorate: this.doctorData().governorate,
      city: this.doctorData().city,
      address: this.doctorData().address,

      specialty: this.doctorData().specialty,

      medicalLevel: this.doctorData().medicalLevel,
    });

    // if (this.doctorData().picture) {
    //   this.imagePreview.set(this.doctorData().picture);
    // }
  }
  GovernatesNames: string[] = [];
  citiesName = signal<string[]>([]);

  constructor() {
    let AllGovernatesData = governorates.getAll();
    const default_GOV = { id: 0, code: '', name: '', nameEn: '' };
    this.GovernatesNames = AllGovernatesData.map((element: any) => element.nameEn);
    this.doctorInfoForm.controls.governorate.valueChanges.subscribe((value) => {
      this.doctorInfoForm.controls.city.setValue('');
      let selectedGovernateData =
        AllGovernatesData.find((element: any) => element.nameEn == value) ?? default_GOV;
      let citiesData = cities.getByGovernorate(selectedGovernateData.code);
      let allnames: string[] = citiesData.map((element: any) => element.nameEn);
      this.citiesName.set(allnames);
      // console.log(selectedGovernateData, allnames);
    });
    // console.log(selectedGovernateData, allnames);
  }
}
