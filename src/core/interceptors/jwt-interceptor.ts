import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/login.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    let authService = inject(AuthService);
    const token = authService.token();

    // check if request should skip auth
    const skipAuth = req.headers.has('skipAuth');

    // remove custom header so backend doesn't see it
    if (skipAuth) {
        req = req.clone({
            headers: req.headers.delete('skipAuth'),
        });
        return next(req);
    }

    // attach token if exists
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    return next(req);
};
