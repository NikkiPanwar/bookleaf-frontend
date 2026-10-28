import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard
 * Verifies that the user is logged in before allowing access to protected routes.
 * Redirects unauthenticated users to /login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return url
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
