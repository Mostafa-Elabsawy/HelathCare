import { Component, signal,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './components/Trash/home/home';
import { Home2 } from './components/Trash/home2/home2';
import { Try2 } from './components/Trash/try2/try2';
import { Testing } from './components/Trash/testing/testing';
import{ PatientRegister } from './components/Patient/patient-register/patient-register';
@Component({
  selector: 'app-root',
  imports: [Testing,Try2,RouterOutlet,Home,Home2, PatientRegister],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {
  protected readonly title = signal('app');
}
