import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
export const adminNavigateGuard: CanActivateFn = (route, state) => {
  const _auth = inject(AuthService);
  const _router = inject(Router);
  const _activatedRout = inject(ActivatedRoute);
  const adminID = Number(localStorage.getItem('admin'));
  const role = localStorage.getItem('role');
  if (role === 'MANAGER') {
    _router.navigateByUrl(`Admin/${adminID}`);
    return false;
  }

  return true;
};
