import { Component, effect, inject, signal, untracked } from '@angular/core';
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
import { DoctorSpecialties } from '../../../../core/Authentication/register/doctor-register/doctor-register.interface';

import { UpdateDoctorProfileAPI } from '../../../../models/doctor-api.interface';
import { EgyDataService } from '../../../../services/egy-data.service';
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
    editDialogVisible = signal(false);
    imagePreview = signal<string>('placeholder1.jpg');
    profileFileName = signal<File | null>(null);

    doctorService = inject(DoctorService);
    egyDataService = inject(EgyDataService);

    genders = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ];

    specialties = DoctorSpecialties;
    medicalLevels = ['General Practitioner (GP)', 'Specialist', 'Consultant'];
    firstNameControl = new FormControl<string>(
        { value: '', disabled: true },
        {
            nonNullable: true,
            validators: [Validators.required],
        },
    );

    lastNameControl = new FormControl<string>(
        { value: '', disabled: true },
        {
            nonNullable: true,
            validators: [Validators.required],
        },
    );

    nationalIdControl = new FormControl<string>(
        { value: '', disabled: true },
        {
            nonNullable: true,
            validators: [Validators.required, Validators.pattern('^[0-9]{14}$')],
        },
    );

    genderControl = new FormControl<string>(
        { value: '', disabled: true },
        {
            nonNullable: true,
            validators: [Validators.required],
        },
    );

    emailControl = new FormControl<string>(
        { value: '', disabled: true },
        {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        },
    );

    phoneControl = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern('^0?1[0125][0-9]{8}$')],
    });

    governorateControl = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
    });

    cityControl = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
    });

    addressControl = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
    });

    specialtyControl = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
    });

    medicalLevelControl = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
    });

    doctorInfoForm = new FormGroup({
        firstName: this.firstNameControl,
        lastName: this.lastNameControl,
        nationalId: this.nationalIdControl,
        gender: this.genderControl,
        email: this.emailControl,
        phone: this.phoneControl,
        governorate: this.governorateControl,
        city: this.cityControl,
        address: this.addressControl,
        specialty: this.specialtyControl,
        medicalLevel: this.medicalLevelControl,
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
            specialty: this.doctorInfoForm.getRawValue().specialty,
            medicalLevel: this.doctorInfoForm.getRawValue().medicalLevel,
            city: this.doctorInfoForm.getRawValue().city,
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

    GovernatesNames = this.egyDataService.GovernatesNames;
    citiesName = signal<string[]>([]);

    constructor() {
        this.doctorInfoForm.controls.governorate.valueChanges.subscribe((value) => {
            this.doctorInfoForm.controls.city.setValue('');
            this.citiesName.set(this.egyDataService.getCities(value) ?? []);
            // console.log(selectedGovernateData, allnames);
        });
        // console.log(selectedGovernateData, allnames);
        effect(() => {
            const profile = this.doctorService.doctor();
            // console.log(profile);

            untracked(() => {
                this.doctorInfoForm.patchValue({
                    phone: profile.phone,
                    governorate: profile.governorate,
                    city: profile.city,
                    address: profile.address,
                    specialty: profile.specialty,
                    medicalLevel: profile.medicalLevel,
                });
                // console.log(profile.governorate, this.doctorInfoForm.controls.governorate.value);
            });
        });
    }
}
