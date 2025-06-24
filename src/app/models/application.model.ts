import { AppType } from './enums';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  WAITING_VOTES = 'WAITING_VOTES',
  WAITING_UNANIMOUS = 'WAITING_UNANIMOUS',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
}

export interface Application {
  id: number;
  createdAt: string;
  targetUser: string;
  type: AppType;
  status: ApplicationStatus; 
  submittedBy: string | { username:string };
  votes: string[];
}