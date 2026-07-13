import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { LabProfile } from '../../../../models/lab-api.interface';
import { LabService } from '../../../../services/lab.service';
import { EgyDataService } from '../../../../services/egy-data.service';

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
  private labService = inject(LabService);
  private egyDataService = inject(EgyDataService);
  labData = input<LabProfile | null>(null);

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

  GovernatesNames = this.egyDataService.GovernatesNames;
  citiesName = signal<string[]>([]);

  valid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  openEditDialog() {
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
    this.labService.updateLabProfile(this.labInfoForm.getRawValue()).subscribe({
      next: () => this.closeEditDialog(),
    });
  }

  constructor() {
    effect(() => {
      const data = this.labData();
      untracked(() => {
        this.labInfoForm.patchValue({
          name: data?.name ?? '',
          email: data?.email ?? '',
          phone: data?.phone ?? '',
          governorate: data?.governorate ?? '',
          city: data?.city ?? '',
          address: data?.address ?? '',
        });
      });
    });

    this.labInfoForm.controls.governorate.valueChanges.subscribe((value) => {
      this.labInfoForm.controls.city.setValue('');
      this.citiesName.set(this.egyDataService.getCities(value) ?? []);
    });
  }
}
