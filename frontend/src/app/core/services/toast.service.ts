import { Injectable, signal } from '@angular/core';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
  action?: ToastAction;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<Toast[]>([]);
  private nextId = 0;

  readonly toasts = this.toastsSignal.asReadonly();

  success(message: string, action?: ToastAction): void {
    this.show(message, 'success', action);
  }

  error(message: string, action?: ToastAction): void {
    this.show(message, 'error', action);
  }

  dismiss(id: number): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  private show(message: string, type: 'success' | 'error', action?: ToastAction): void {
    const id = this.nextId++;
    this.toastsSignal.update(toasts => [...toasts, { id, message, type, action }]);
    setTimeout(() => this.dismiss(id), 6000);
  }
}
