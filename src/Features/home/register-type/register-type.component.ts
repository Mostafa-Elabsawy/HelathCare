import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from "primeng/button";

@Component({
  selector: 'app-register-type',
  imports: [ButtonDirective,RouterLink],
  templateUrl: './register-type.component.html',
  styleUrl: './register-type.component.css',
})
export class RegisterType {

}
