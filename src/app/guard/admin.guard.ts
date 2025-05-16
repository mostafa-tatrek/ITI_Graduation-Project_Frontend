import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
export const adminGuard: CanActivateFn = (route, state) => {
  const _auth = inject(AuthService);
  const _router = inject(Router);

  const role = localStorage.getItem('role');
  if (role == 'MANAGER') {
    return true;
  }
  _router.navigateByUrl('home');
  return false;
};
