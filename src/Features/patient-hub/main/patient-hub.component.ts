import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-main',
    imports: [RouterOutlet,HeaderComponent],
    templateUrl: './patient-hub.component.html',
    styleUrl: './patient-hub.component.css',
})
export class PatientHubComponent {}
