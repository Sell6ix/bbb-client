import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { AppType } from '../../../models/enums';

@Component({
  selector: 'app-new-admin-app-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-admin-app-dialog.component.html',
  styleUrl: './new-admin-app-dialog.component.css'
})
export class NewAdminAppDialogComponent {
  private api = inject(ApiService);
  private dialogRef = inject(MatDialogRef<NewAdminAppDialogComponent>);

  targetUser = '';
  type: AppType = AppType.MEMBER;

  submit() {
    this.api.createApplication({ targetUser: this.targetUser, type: this.type }).subscribe({
      next: () => this.dialogRef.close('success'),
      error: () => alert('Failed to create application')
    });
  }

  close() {
    this.dialogRef.close();
  }
}
