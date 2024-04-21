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

  show(toast: Toast) {
    this.toasts.push(toast);
  }

  remove(toast: Toast) {
    console.log(this.toasts)
    this.toasts = this.toasts.filter((t) => t !== toast);
    console.log(this.toasts)
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
