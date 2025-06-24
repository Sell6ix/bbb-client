import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { User } from '../models/user.model';   

export function RoleGuard(...allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth   = inject(AuthService);
    const router = inject(Router);

    
    return toObservable(auth.user()).pipe(
      filter((u): u is User => u !== null),   
      take(1),                                
      map(u => {
        if (allowedRoles.includes(u.role)) {
          return true;                        
        }
        router.navigate(['/home']);           
        return false;
      })
    );
  };
}
