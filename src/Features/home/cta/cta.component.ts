import { Component } from '@angular/core';
import { ButtonDirective } from "primeng/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta',
  imports: [RouterLink],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.css',
})
export class Cta {

}
