import { Component, input, output, signal } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { AbstractControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup,FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { PasswordModule, Password } from 'primeng/password';
import { StepperModule } from "primeng/stepper";
import {CheckboxModule} from 'primeng/checkbox';
import { SecurityDataSchema } from '../interface';
@Component({
  selector: 'patient-security-info',
  imports: [ReactiveFormsModule, InputText, CheckboxModule, Password, StepperModule],
  templateUrl: './security.html',
  styleUrl: './security.css',
})
export class Security {
  output = output<any>();
  regex=[Validators.pattern('.*[a-z].*'),Validators.pattern('.*[A-Z].*'),Validators.pattern('.*[0-9].*'),Validators.pattern('.*[!@#$%^&*].*')]
  password = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      ...this.regex,
    ],
  });
  confirmPassword = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      (control: AbstractControl) => {
        const password = this.password.value;
        const confirmPassword = control.value;
        if (password !== confirmPassword) {
          return { passwordMismatch: true };
        }
        return null;
      },
    ],
  });
  checkBox=new FormControl<boolean>(false,{nonNullable:true,validators:[Validators.required,Validators.requiredTrue]});

  securityData = new FormGroup({
    password: this.password,
    confirmPassword: this.confirmPassword,
    checkBox: this.checkBox
  });
  valid(input: FormControl): boolean {
    return input.invalid && input.touched;
  }
  constructor() {
    this.securityData.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      let data:SecurityDataSchema ={
        value: this.securityData.getRawValue(),
        valid: this.securityData.valid
      }
      // console.log(value,this.securityData.valid);
      this.output.emit(data);
    });
  }
}
