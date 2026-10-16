import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authentication } from '../services/authentication';

// Adds "Authorization: Bearer <token>" to every request when logged in
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Authentication);
  const isAuthCall = req.url.includes('/login') || req.url.includes('/register');

  if (auth.isLoggedIn() && !isAuthCall) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${auth.getToken()}` }
    });
    return next(authReq);
  }
  return next(req);
};
