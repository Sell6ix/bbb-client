import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationCardComponent } from '../../components/application-card/application-card.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewApplicationDialogComponent } from '../../components/new-application-dialog/new-application-dialog.component'; 
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Application } from '../../models/application.model';
import { AppType } from '../../models/enums';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatMenuModule, 
    CommonModule, 
    MatButtonModule, 
    MatDialogModule, 
    ApplicationCardComponent, 
    RouterModule,   
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule,
    MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private api = inject(ApiService);
  public auth = inject(AuthService);
  private dialog = inject(MatDialog);
  AppType = AppType;
  router = inject(Router);
  selectedAppType = AppType.MEMBER;

  mine = signal<Application[]>([]);
  broApplications = signal<Application[]>([]);
  loadingMine = signal(false);
  loadingTarget = signal(false);

  user = this.auth.user();
  avatarUrl = computed(() => `https://api.dicebear.com/8.x/thumbs/svg?seed=${this.user()?.username}`);

  targeted = signal<Application[]>([]);

  pendingMember = computed(() => {
    if (this.user()?.role !== 'BRO') return null;
    return this.targeted().find((a) => a.targetUser === this.user()?.username && a.type === AppType.MEMBER);
  });

  pendingAdmin = computed(() => {
    if (this.user()?.role === 'ADMIN') return null;
    return this.targeted().find((a) => a.targetUser === this.user()?.username && a.type === AppType.ADMIN);
  });

  isMember = computed(() => this.user()?.role === AppType.MEMBER);
  isAdmin = computed(() => this.user()?.role === AppType.ADMIN);

  constructor() {
    this.refresh();
  }

  onRemoved(id: number) {
    this.mine.update(arr => arr.filter(a => a.id !== id));
    this.refresh();
  }

  refresh() {
    const username = this.user()?.username;
    if (!username) return;

    this.loadingMine.set(true);
    this.api.getMine().subscribe({
      next: (list) => {
        this.mine.set(list);
        this.loadingMine.set(false);
      },
      error: () => this.loadingMine.set(false),
    });

    this.loadingTarget.set(true);
    this.api.getTargeted(username).subscribe({
      next: (list) => {
        this.targeted.set(list);
        this.loadingTarget.set(false);
      },
      error: () => this.loadingTarget.set(false),
    });
  }

  openNewApplication(type: AppType) {
  const currentUsername = this.user()?.username;
  if (!currentUsername) return;

  const dialogRef = this.dialog.open(NewApplicationDialogComponent, {
    data: { type, currentUser: currentUsername }
  });

  const instance = dialogRef.componentInstance;
  instance.currentUser = currentUsername;

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result && result.targetUser !== currentUsername) {
      this.refresh();
    } else if (result && result.targetUser === currentUsername) {
      alert("You can't submit an application for yourself.");
    }
  });
}



  logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}
}
