import { Component, inject, input, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { governorates, cities } from 'egydata';

export interface LabProfileData {
  name: string;
  email: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
}

@Component({
  selector: 'app-edit-lab-info',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './edit-lab-info.component.html',
  styleUrl: './edit-lab-info.component.css',
})
export class EditLabInfoComponent {
  labData = input<LabProfileData>({
    name: '',
    email: '',
    phone: '',
    governorate: '',
    city: '',
    address: '',
  });

  editDialogVisible = signal(false);

  labInfoForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>(
      { value: '', disabled: true },
      { nonNullable: true, validators: [Validators.required, Validators.email] },
    ),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern('^0?1[1|2|5|0][0-9]{8}$')],
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
  });

  valid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  openEditDialog() {
    this.labInfoForm.patchValue({
      name: this.labData().name,
      email: this.labData().email,
      phone: this.labData().phone,
      governorate: this.labData().governorate,
      city: this.labData().city,
      address: this.labData().address,
    });
    this.editDialogVisible.set(true);
  }

  closeEditDialog() {
    this.editDialogVisible.set(false);
  }

  saveChanges() {
    if (!this.labInfoForm.valid) {
      this.labInfoForm.markAllAsTouched();
      return;
    }

    console.log('Lab profile update:', this.labInfoForm.getRawValue());
    this.closeEditDialog();
  }

  GovernatesNames: string[] = [];
  citiesName = signal<string[]>([]);

  constructor() {
    const AllGovernatesData = governorates.getAll();
    const default_GOV = { id: 0, code: '', name: '', nameEn: '' };
    this.GovernatesNames = AllGovernatesData.map((element: any) => element.nameEn);
    this.labInfoForm.controls.governorate.valueChanges.subscribe((value) => {
      this.labInfoForm.controls.city.setValue('');
      const selectedGovernateData =
        AllGovernatesData.find((element: any) => element.nameEn == value) ?? default_GOV;
      const citiesData = cities.getByGovernorate(selectedGovernateData.code);
      this.citiesName.set(citiesData.map((element: any) => element.nameEn));
    });
  }
}
