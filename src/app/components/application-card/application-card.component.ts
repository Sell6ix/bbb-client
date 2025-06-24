import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../core/api.service';
import { Application } from '../../models/application.model';
import { AuthService } from '../../core/auth.service';
import { AppType } from '../../models/enums';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css'
})
export class ApplicationCardComponent {
  @Input({ required: true }) app!: Application;
  @Input() canVote = false;
  @Input() canUnvote = false;
  @Input() isSubmitter = false;
  @Output() removed = new EventEmitter<number>();
  @Output() refreshed = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private errorService = inject(ErrorService);
  currentUser = this.auth.user();

  get votesDisplay(): string {
    return (this.app.votes ?? []).join(', ') || 'None';
  }

  vote() {
    this.api.vote(Number(this.app.id)).subscribe(() => this.refreshed.emit());
  }

  unvote() {
    this.api.unvote(Number(this.app.id)).subscribe(() => this.refreshed.emit());
  }

  remove() {
    this.api.deleteApplication(Number(this.app.id)).subscribe({
      next: () => this.removed.emit(this.app.id),
      error: (err: any) => this.errorService.show(err?.error?.message || 'Failed to delete'),
    });
  }

  get submitterDisplay(): string {
    const sb = this.app.submittedBy;
    if (typeof sb === 'string') return sb;
    return sb.username ?? 'Unknown';
  }

  get statusLabel(): string {
    return {
      PENDING: '⌛ Pending',
      WAITING_UNANIMOUS: '⌛ Waiting for unanimous votes',
      WAITING_VOTES: '⌛ Waiting for votes',
      APPROVED: '✅ Approved',
      CANCELLED: '❌ Cancelled',
    }[this.app.status] ?? '⌛ Pending';
  }

  onDelete() {
    this.api.deleteApplication(this.app.id).subscribe({
      next: () => this.deleted.emit(),
      error: (err: any) => this.errorService.show(err?.error?.message || 'Delete failed')
    });
  }

  get cardColor(): string {
  switch (this.app.status) {
    case 'APPROVED':
      return '#c8e6c9';
    case 'CANCELLED':
      return '#ffcdd2';
    case 'PENDING':
    case 'WAITING_VOTES':
    case 'WAITING_UNANIMOUS':
      return '#fff9c4';
    default:
      return 'white';
  }
}

}
