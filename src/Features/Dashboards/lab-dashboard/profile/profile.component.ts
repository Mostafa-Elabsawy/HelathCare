import { Component, inject } from '@angular/core';
import { EditLabInfoComponent } from '../edit/edit-lab-info.component';
import { LabService } from '../../../../services/lab.service';

@Component({
  selector: 'app-lab-profile',
  imports: [EditLabInfoComponent],
  templateUrl: './profile.component.html',
})
export class LabProfile {
  private labService = inject(LabService);
  labData = this.labService.lab;
}
