import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authErrorInterceptor: HttpInterceptorFn =(req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {

      const status = error.status;

      switch (status) {

        // 🔴 400 - Bad Request (invalid data)
        case 400:
          console.error('❌ Bad Request: Invalid data or missing fields');
          break;

        // 🔴 401 - Unauthorized (no token / login required)
        case 401:
          console.error('🔐 Unauthorized: Please login again');
          localStorage.removeItem('token');
          router.navigate(['/unauthorized']);
          break;

        // 🔴 403 - Forbidden (no permission)
        case 403:
          console.error('⛔ Forbidden: You do not have permission');
          break;

        // 🔴 404 - Not Found
        case 404:
          console.error('🔍 Not Found: API or resource does not exist');
          break;

        // 🔴 422 - Validation error
        case 422:
          console.error('⚠️ Validation Error: Check input fields');
          break;

        // 🔴 500 - Internal server error
        case 500:
          console.error('💥 Internal Server Error: Backend crashed');
          break;

        // 🔴 502 - Bad Gateway
        case 502:
          console.error('🌐 Bad Gateway: Invalid server response');
          break;

        // 🔴 503 - Service unavailable
        case 503:
          console.error('🚧 Service Unavailable: Server is down or overloaded');
          break;

        // 🔴 504 - Gateway timeout
        case 504:
          console.error('⏱️ Gateway Timeout: Server took too long to respond');
          break;

        // 🔴 Unknown errors
        default:
          console.error('❗ Unexpected error:', error);
          break;
      }

      // rethrow so components can still handle if needed
      return throwError(() => error);
    })
  );
};