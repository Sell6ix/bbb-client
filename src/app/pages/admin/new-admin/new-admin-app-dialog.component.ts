import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/api.service';
import { AppType } from '../../../models/enums';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';

@Component({
  selector: 'app-new-admin-app-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf,MatButtonToggle,MatButtonToggleGroup],
  templateUrl: './new-admin-app-dialog.component.html',
  styleUrl: './new-admin-app-dialog.component.css'
})
export class NewAdminAppDialogComponent {
  private api = inject(ApiService);
  private dialogRef = inject(MatDialogRef<NewAdminAppDialogComponent>);
  currentUser!: string;
  errorMessage : string | null = null;

  targetUser = '';
  type: AppType = AppType.MEMBER;

   isAdmin(): Boolean{
    return this.type===AppType.ADMIN;
  }

  submit() {
    this.errorMessage = null;
  
    this.api.createApplication({ targetUser: this.targetUser, type: this.type }).subscribe({
      next: () => this.dialogRef.close('success'),
      error: (err) => {
        this.errorMessage= err?.error?.message || 'Failed to submit application';
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
// git config --global user.email "egorovid2001@gmail.com "
//   git config --global user.name "sell6ix"