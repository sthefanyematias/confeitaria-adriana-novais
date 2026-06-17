
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');

    if (token) {
        const reqComToken = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(reqComToken);
    }

    return next(req);
};
