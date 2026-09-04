import { Component, inject } from '@angular/core';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 w-96 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-4 pl-4 border-l-4 animate-toast-in"
          [class.border-emerald-500]="toast.type === 'success'"
          [class.border-red-500]="toast.type === 'error'"
        >
          <div class="shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l2.25 2.25 5.25-5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } @else {
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900">
              {{ toast.type === 'success' ? 'Success' : 'Error' }}
            </p>
            <p class="text-sm text-gray-600 mt-0.5 break-words">
              {{ toast.message }}
            </p>
            @if (toast.action) {
              <button
                (click)="toast.action.onClick(); toastService.dismiss(toast.id)"
                class="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {{ toast.action.label }} →
              </button>
            }
          </div>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 text-gray-400 hover:text-gray-600 transition-colors rounded-md p-0.5 hover:bg-gray-100"
            aria-label="Dismiss"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
