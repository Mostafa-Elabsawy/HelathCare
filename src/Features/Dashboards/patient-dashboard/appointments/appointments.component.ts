import { Component } from '@angular/core';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Button } from "primeng/button";
import { RouterLink } from '@angular/router';

interface AppointmentActions { 
  label: string;
  icon: string;
  command():void
}
@Component({
  selector: 'app-appointments',
  imports: [SplitButtonModule, Button, RouterLink],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class Appointments {
  items: any[] = [];
  constructor() {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => { }
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
        command: () => {},
      },
      {
        separator: true,
      },
      {
        label: 'Quit',
        icon: 'pi pi-power-off',
        command: () => {},
      },
    ];
  }
  onDropdownClick() { console.log("mostafa");
  }
}
