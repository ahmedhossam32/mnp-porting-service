import { Component, effect, inject, signal, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PortingRequestService } from '../core/services/porting-request.service';
import { ToastService } from '../core/services/toast.service';
import { OperatorContextService } from '../core/services/operator-context.service';
import { PortingRequestResponseDto } from '../models/porting-request.model';
import { ErrorResponseDto } from '../models/error-response.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-request-list',
  standalone: true,
  template: `
    <div class="max-w-5xl mx-auto">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">All Requests</h1>
          <p class="text-sm text-gray-500 mt-1">
            Showing requests visible to {{ formatOperator(operatorContext.currentOperator()) }}
          </p>
        </div>
        <button
          (click)="refresh()"
          class="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden">
        @if (loading()) {
          <div class="flex flex-col items-center justify-center py-16">
            <div class="w-8 h-8 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin"></div>
            <p class="mt-3 text-sm text-gray-500">Loading requests...</p>
          </div>
        } @else if (requests().length === 0) {
          <div class="flex flex-col items-center justify-center py-16">
            <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l3.5-5h11L21 8m-18 0v9a2 2 0 002 2h14a2 2 0 002-2V8m-18 0h18M3 8l3 4h4l1 2h2l1-2h4l3-4" />
            </svg>
            <h3 class="mt-3 text-sm font-semibold text-gray-900">No requests found</h3>
            <p class="mt-1 text-sm text-gray-500">Requests visible to this operator will appear here</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Donor</th>
                  <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                  <th class="px-4 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (request of requests(); track request.id) {
                  <tr (click)="openDetail(request.id)" class="hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
                    <td class="px-4 py-3.5 text-sm text-gray-400 font-mono">#{{ request.id }}</td>
                    <td class="px-4 py-3.5 text-sm font-medium text-gray-900 font-mono">{{ request.phoneNumber }}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-700">
                      <span class="flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full" [class]="operatorDotClass(request.recipientOperator)"></span>
                        {{ formatOperator(request.recipientOperator) }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-sm text-gray-700">
                      <span class="flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full" [class]="operatorDotClass(request.donorOperator)"></span>
                        {{ formatOperator(request.donorOperator) }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-sm">
                      <span
                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class]="statusClasses(request.status)"
                      >
                        <span class="w-1.5 h-1.5 rounded-full" [class]="statusDotClass(request.status)"></span>
                        {{ request.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-sm text-gray-500">{{ formatDate(request.createdAt) }}</td>
                    <td class="px-4 py-3.5 text-right" (click)="$event.stopPropagation()">
                      @if (canActOn(request)) {
                        <div class="flex justify-center gap-1.5">
                          <button
                            (click)="onAccept(request, $event)"
                            class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Accept
                          </button>
                          <button
                            (click)="onReject(request, $event)"
                            class="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      @if (totalPages() > 1) {
        <div class="flex justify-between items-center mt-4">
          <p class="text-sm text-gray-500">Page {{ currentPage() + 1 }} of {{ totalPages() }}</p>
          <div class="flex gap-2">
            <button
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 0"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() >= totalPages() - 1"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      }

      @if (selectedRequest() || modalLoading()) {
        <div
          class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          (click)="closeDetail()"
        >
          <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-toast-in"
            (click)="$event.stopPropagation()"
          >
            @if (modalLoading()) {
              <div class="flex flex-col items-center py-8">
                <div class="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                <p class="text-sm text-gray-500 mt-3">Loading details...</p>
              </div>
            } @else if (selectedRequest(); as req) {
              <div class="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <h3 class="text-xl font-bold text-gray-900">Request #{{ req.id }}</h3>
                <button
                  (click)="closeDetail()"
                  class="text-gray-400 hover:text-gray-600 rounded-md p-1 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <dl class="divide-y divide-gray-100">
                <div class="grid grid-cols-[100px_1fr] items-center py-2.5">
                  <dt class="text-xs uppercase tracking-wide font-medium text-gray-400">Phone Number</dt>
                  <dd class="text-base font-bold text-gray-900 text-right font-mono">{{ req.phoneNumber }}</dd>
                </div>
                <div class="grid grid-cols-[100px_1fr] items-center py-2.5">
                  <dt class="text-xs uppercase tracking-wide font-medium text-gray-400">Recipient</dt>
                  <dd class="text-sm font-medium text-gray-900 text-right">
                    <span class="flex items-center gap-1.5 justify-end">
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        [class.bg-red-500]="req.recipientOperator === 'VODAFONE'"
                        [class.bg-orange-500]="req.recipientOperator === 'ORANGE'"
                        [class.bg-emerald-500]="req.recipientOperator === 'ETISALAT'"
                      ></span>
                      {{ formatOperator(req.recipientOperator) }}
                    </span>
                  </dd>
                </div>
                <div class="grid grid-cols-[100px_1fr] items-center py-2.5">
                  <dt class="text-xs uppercase tracking-wide font-medium text-gray-400">Donor</dt>
                  <dd class="text-sm font-medium text-gray-900 text-right">
                    <span class="flex items-center gap-1.5 justify-end">
                      <span
                        class="w-1.5 h-1.5 rounded-full"
                        [class.bg-red-500]="req.donorOperator === 'VODAFONE'"
                        [class.bg-orange-500]="req.donorOperator === 'ORANGE'"
                        [class.bg-emerald-500]="req.donorOperator === 'ETISALAT'"
                      ></span>
                      {{ formatOperator(req.donorOperator) }}
                    </span>
                  </dd>
                </div>
                <div class="grid grid-cols-[100px_1fr] items-center py-2.5">
                  <dt class="text-xs uppercase tracking-wide font-medium text-gray-400">Status</dt>
                  <dd class="text-right">
                    <span
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      [class.bg-amber-100]="req.status === 'PENDING'"
                      [class.text-amber-800]="req.status === 'PENDING'"
                      [class.bg-emerald-100]="req.status === 'ACCEPTED'"
                      [class.text-emerald-800]="req.status === 'ACCEPTED'"
                      [class.bg-red-100]="req.status === 'REJECTED'"
                      [class.text-red-800]="req.status === 'REJECTED'"
                      [class.bg-gray-100]="req.status === 'CANCELED'"
                      [class.text-gray-600]="req.status === 'CANCELED'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" [class]="statusDotClass(req.status)"></span>
                      {{ req.status }}
                    </span>
                  </dd>
                </div>
                <div class="grid grid-cols-[100px_1fr] items-center py-2.5">
                  <dt class="text-xs uppercase tracking-wide font-medium text-gray-400">Created</dt>
                  <dd class="text-sm font-medium text-gray-900 text-right">{{ formatDate(req.createdAt) }}</dd>
                </div>
                <div class="grid grid-cols-[100px_1fr] items-center py-2.5">
                  <dt class="text-xs uppercase tracking-wide font-medium text-gray-400">Last Updated</dt>
                  <dd class="text-sm font-medium text-gray-900 text-right">{{ formatDate(req.updatedAt) }}</dd>
                </div>
              </dl>

              @if (canActOn(req)) {
                <div class="flex gap-2 mt-5">
                  <button
                    (click)="onAccept(req, $event)"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Accept
                  </button>
                  <button
                    (click)="onReject(req, $event)"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </div>
              }

              <button
                (click)="closeDetail()"
                class="mt-5 w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class RequestListComponent {
  private readonly portingRequestService = inject(PortingRequestService);
  private readonly toastService = inject(ToastService);
  protected readonly operatorContext = inject(OperatorContextService);

  protected readonly requests = signal<PortingRequestResponseDto[]>([]);
  protected readonly loading = signal(false);
  protected readonly currentPage = signal(0);
  protected readonly totalPages = signal(0);
  protected readonly totalElements = signal(0);
  protected readonly selectedRequest = signal<PortingRequestResponseDto | null>(null);
  protected readonly modalLoading = signal(false);

  constructor() {
    effect(() => {
      this.operatorContext.currentOperator();
      this.currentPage.set(0);
      this.fetchRequests();
    });
  }

  protected refresh(): void {
    this.fetchRequests();
  }

  protected goToPage(page: number): void {
    this.currentPage.set(page);
    this.fetchRequests();
  }

  protected openDetail(id: number): void {
    this.modalLoading.set(true);
    this.selectedRequest.set(null);

    this.portingRequestService.getById(id).subscribe({
      next: (response) => {
        this.selectedRequest.set(response);
        this.modalLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.modalLoading.set(false);
        const errorBody = err.error as ErrorResponseDto | undefined;
        this.toastService.error(errorBody?.message ?? 'Failed to load request details.');
      }
    });
  }

  protected closeDetail(): void {
    this.selectedRequest.set(null);
  }

  protected onAccept(request: PortingRequestResponseDto, event: Event): void {
    event.stopPropagation();
    this.portingRequestService.accept(request.id).subscribe({
      next: (updated) => {
        this.toastService.success(`Request #${updated.id} accepted.`);
        this.fetchRequests();
        if (this.selectedRequest()?.id === updated.id) {
          this.selectedRequest.set(updated);
        }
      },
      error: (err: HttpErrorResponse) => {
        const errorBody = err.error as ErrorResponseDto | undefined;
        this.toastService.error(errorBody?.message ?? 'Failed to accept request.');
      }
    });
  }

  protected onReject(request: PortingRequestResponseDto, event: Event): void {
    event.stopPropagation();
    this.portingRequestService.reject(request.id).subscribe({
      next: (updated) => {
        this.toastService.success(`Request #${updated.id} rejected.`);
        this.fetchRequests();
        if (this.selectedRequest()?.id === updated.id) {
          this.selectedRequest.set(updated);
        }
      },
      error: (err: HttpErrorResponse) => {
        const errorBody = err.error as ErrorResponseDto | undefined;
        this.toastService.error(errorBody?.message ?? 'Failed to reject request.');
      }
    });
  }

  protected canActOn(request: PortingRequestResponseDto): boolean {
    return request.status === 'PENDING' && request.donorOperator === this.operatorContext.currentOperator();
  }

  protected formatOperator(op: string): string {
    return op.charAt(0) + op.slice(1).toLowerCase();
  }

  protected formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  protected statusClasses(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELED':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  protected statusDotClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500';
      case 'ACCEPTED':
        return 'bg-emerald-500';
      case 'REJECTED':
        return 'bg-red-500';
      case 'CANCELED':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  }

  protected operatorDotClass(op: string): string {
    switch (op.toUpperCase()) {
      case 'VODAFONE':
        return 'bg-red-500';
      case 'ORANGE':
        return 'bg-orange-500';
      case 'ETISALAT':
        return 'bg-emerald-500';
      default:
        return 'bg-gray-400';
    }
  }

  private fetchRequests(): void {
    const page = untracked(() => this.currentPage());
    this.loading.set(true);

    this.portingRequestService.list(page, PAGE_SIZE).subscribe({
      next: (response) => {
        this.requests.set(response.content);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const errorBody = err.error as ErrorResponseDto | undefined;
        this.toastService.error(errorBody?.message ?? 'Failed to load porting requests.');
      }
    });
  }
}
