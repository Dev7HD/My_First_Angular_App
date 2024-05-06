import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {LoadingService} from "../services/loading.service";
import {Injectable} from "@angular/core";

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.showSpinner();
    return next.handle(req).pipe(
      finalize(()=>{
        this.loadingService.hideSpinner();
      })
    );
  }

}
