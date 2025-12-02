import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginRegisterGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is authenticated, redirect to home/dashboard
  if (authService.isAuthenticated()) {
    router.navigate(['/'], { replaceUrl: true }); // replaceUrl prevents back button going back
    return false;
  }

  return true; // allow access to login/register
};
