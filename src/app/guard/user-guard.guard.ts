import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
export const userGuardGuard: CanActivateFn = async (route, state) => {
  const _auth = inject(AuthService);
  const _router = inject(Router);
  const isLogged = Number(localStorage.getItem('userId'));
  if (isLogged != 0) {
    return true;
  }
  _router.navigateByUrl('home');
  return false;
};
