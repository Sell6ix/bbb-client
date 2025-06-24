import { Role, AppType } from '../models/enums';

interface Submitter {
  username: string;
  role: Role;
}

interface User {
  username: string;
  role: Role;
}

interface Application {
  targetUser: string;
  type: AppType;
}

export async function validateApplicationCreation(
  submitter: Submitter,
  targetUsername: string,
  type: AppType,
  users: User[],
  applications: Application[]
): Promise<string | null> {
  if (submitter.username === targetUsername) {
    return 'You cannot submit an application for yourself';
  }

  if (submitter.role === Role.MEMBER && type !== AppType.MEMBER) {
    return 'Members can only submit MEMBER applications';
  }

  if (![Role.ADMIN, Role.MEMBER].includes(submitter.role)) {
    return 'More permissions are required to submit an application';
  }

  const target = users.find(u => u.username === targetUsername);
  if (!target) return 'Target user not found';

  if (type === AppType.ADMIN && target.role === Role.BRO) {
    return 'Target must first be a MEMBER before applying for ADMIN';
  }

  if (type === AppType.MEMBER && target.role === Role.ADMIN) {
    return 'Cannot downgrade an ADMIN to MEMBER';
  }

  if (
    (type === AppType.MEMBER && target.role === Role.MEMBER) ||
    (type === AppType.ADMIN && target.role === Role.ADMIN)
  ) {
    return 'Target user already has this role';
  }

  const existingApp = applications.find(
    app => app.targetUser === targetUsername && app.type === type
  );

  if (existingApp) {
    return `An active ${type} application already exists for this user`;
  }

  return null;
}
