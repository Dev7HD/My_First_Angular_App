import {Injectable, TemplateRef} from '@angular/core';
import {Toast, ToastService} from "./toast-service.service";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private toastService:ToastService) { }

  show(template: TemplateRef<any>) {
    this.toastService.show({template: template, text: 'Loading....', classname: 'p-3', delay: 4500});
  }
}
