import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationService } from '../../services/application.service';
import { AppType } from '../../models/enums';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-new-application-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatDialogModule,
    MatButtonToggleModule
  ],
  templateUrl: './new-application-dialog.component.html',
  styleUrls: ['./new-application-dialog.component.css']
})
export class NewApplicationDialogComponent {
  private dialogRef = inject(MatDialogRef<NewApplicationDialogComponent>);
  private appService = inject(ApplicationService);
  private fb = inject(FormBuilder);
  AppType = AppType; 

  type!: AppType;
  currentUser!: string;

  form = this.fb.group({
    targetUser: ['', Validators.required],
    type: [this.type || AppType.MEMBER, Validators.required] 
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { type: AppType, currentUser: string }) {}

  ngOnInit() {
    this.type = this.data.type;
    this.currentUser = this.data.currentUser;
    this.form.patchValue({ type: this.type });
  }

  onSubmit() {
  if (this.form.invalid) return;

  const targetUser = this.form.value.targetUser?.trim() ?? '';
  const type = this.form.value.type as AppType;

  if (!targetUser) {
    alert('Please enter a username');
    return;
  }

  if (targetUser === this.currentUser) {
    alert("You can't submit an application for yourself.");
    return;
  }

  this.appService.create({ targetUser, type }).subscribe({
    next: () => this.dialogRef.close({ targetUser, type }),
    error: (err) => {
      const msg = err?.error?.message || 'Failed to submit application';
      alert(msg);
    }
  });
}


  cancel() {
    this.dialogRef.close();
  }
}
