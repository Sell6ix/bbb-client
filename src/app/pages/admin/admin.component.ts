import { Component, inject, signal, computed } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { Application, ApplicationStatus } from '../../models/application.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewAdminAppDialogComponent } from './new-admin/new-admin-app-dialog.component';
import { RouterModule } from '@angular/router';
import { AppType, Role } from '../../models/enums';
import { CommonModule } from '@angular/common';
import { ApplicationCardComponent } from '../../components/application-card/application-card.component';
import { AuthService } from '../../core/auth.service';
import { User } from '../../models/user.model';

interface DisplayColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule,
    CommonModule,
    ApplicationCardComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private auth = inject(AuthService);
  adminsCount = signal(0);

  apps = signal<Application[]>([]);
  selectedStatus = signal<ApplicationStatus | ''>('');
  currentUser = this.auth.user();

  displayedColumns: DisplayColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'target', label: 'Target', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'approvers', label: 'Approvers' },
    { key: 'actions', label: 'Actions' }
  ];

  columnKeys = this.displayedColumns.map(c => c.key);

  filteredApps = computed(() => {
    const status = this.selectedStatus();
    if (!status) return this.apps();
    return this.apps().filter(app => app.status === status);
  });

  constructor() {
    this.loadAdminsCount();
    this.load();
  }

  loadAdminsCount() {
  this.api.getAllUsers().subscribe({
    next: (users: User[]) => {
      const admins = users.filter(u => u.role === 'ADMIN');
      this.adminsCount.set(admins.length);
    },
    error: () => this.adminsCount.set(0),
  });
}

  load() {
    this.api.getAll().subscribe({
      next: (a) => this.apps.set(a),
      error: (err) => console.error('Failed to load applications:', err),
    });
  }

  refresh() {
    this.load();
  }

  onStatusFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus.set(select.value as ApplicationStatus | '');
  }

  vote(a: Application) {
    this.api.vote(a.id).subscribe(() => this.load());
  }

  unvote(a: Application) {
    this.api.unvote(a.id).subscribe(() => this.load());
  }

  closeApplication(a: Application) {
    this.api.deleteApplication(a.id).subscribe(() => this.load());
  }

  openNewAdminApp() {
    const dialogRef = this.dialog.open(NewAdminAppDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.load();
      }
    });
  }

  requiredVotes(app: Application): number {
  return app.type === AppType.ADMIN ? this.adminsCount() : 2;
}

hasEnoughVotes(app: Application): boolean {
  if (app.type === AppType.ADMIN) {
    return (app.votes?.length ?? 0) === this.adminsCount();
  }
  return (app.votes?.length ?? 0) >= 2;
}

canVote(app: Application): boolean {
  const user = this.currentUser();
  return !this.hasEnoughVotes(app) && !!user && !app.votes.includes(user.username);
}

canUnvote(app: Application): boolean {
  const user = this.currentUser();
  return !!user && app.votes.includes(user.username);
}

  get allApplications() {
    return this.filteredApps();
  }

}
