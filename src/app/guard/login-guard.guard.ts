import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
export const loginGuardGuard: CanActivateFn = async (route, state) => {
  const _auth = inject(AuthService);
  const _router = inject(Router);
  const isLogged = Number(localStorage.getItem('userId'));
  if (isLogged == 0) {
    _router.navigateByUrl('home');
    return false;
  }
  return true;
};
