import { HttpInterceptorFn } from '@angular/common/http';

export const appInterceptInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

export class HttpInterceptor implements HttpInterceptor {
  
}
