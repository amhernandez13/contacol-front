import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  const isLoggedIn = loginService.isLoged();
  const userRole = loginService.getRole();

  if (!isLoggedIn) {
    router.navigateByUrl('/'); // Si no está logueado, redirigir al login
    return false;
  }

  const requiredRoles = route.data?.['role'];

  // Funcion para verificar si el usuario esta en el array
  if (
    requiredRoles &&
    Array.isArray(requiredRoles) &&
    requiredRoles.includes(userRole)
  ) {
    return true; // El rol del usuario está en el array permitido
  }

  router.navigateByUrl('/'); // Si no coincide, redirigir al login o página predeterminada
  return false;
};
