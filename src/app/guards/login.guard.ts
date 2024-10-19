import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  if (loginService.isLoged()) {
    return true;
  } else {
    router.navigateByUrl('/'); // Si no está autenticado, redirige al login
    return false;
  }
};
