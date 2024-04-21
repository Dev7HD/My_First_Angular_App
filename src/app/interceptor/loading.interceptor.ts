import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoadingService} from "../services/loading.service";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

export class LoadingInterceptor implements HttpInterceptor {


  constructor(private loadingService: LoadingService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        throw new Error('Method not implemented.');
        //this.loadingService.show(standardTemplateRef)
    }

}
