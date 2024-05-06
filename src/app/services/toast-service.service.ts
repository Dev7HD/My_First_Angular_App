import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
  html?: string;
  text?: string;
  template: TemplateRef<any>;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  standardToastClassName:string = 'p-3';
  successToastClassName:string = 'bg-success text-light p-3';
  errorToastClassName:string = 'bg-danger text-light p-3';

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}

