import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PortingRequestService } from '../core/services/porting-request.service';
import { ToastService } from '../core/services/toast.service';
import { PhoneStatusResponseDto } from '../models/phone-status.model';
import { ErrorResponseDto } from '../models/error-response.model';

const PHONE_NUMBER_PATTERN = /^0[0-9]{10}$/;
const PHONE_NUMBER_ERROR = 'Phone number must be 11 digits starting with 0';

@Component({
  selector: 'app-phone-status',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto mt-12 bg-white rounded-2xl shadow p-10">
      <div class="flex flex-col items-center text-center mb-6">
        <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Check Phone Number Status</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          id="phoneNumber"
          type="text"
          formControlName="phoneNumber"
          placeholder="01234567890"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        @if (phoneNumberInvalid()) {
          <p class="mt-1 text-sm text-red-600">{{ phoneNumberError }}</p>
        }
        <button
          type="submit"
          [disabled]="checking() || form.invalid"
          class="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          @if (checking()) {
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span>Checking...</span>
          } @else {
            <span>Check Status</span>
          }
        </button>
      </form>

      @if (result(); as res) {
        <div class="bg-gray-50 rounded-xl p-5 mt-5 border border-gray-200">
          <p class="text-lg font-bold text-gray-900 font-mono">{{ res.phoneNumber }}</p>

          <div class="flex justify-between items-center py-2 mt-2 border-t border-gray-200">
            <span class="text-sm text-gray-500">Current Holder</span>
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full" [class]="operatorDotClass(res.currentHolder)"></span>
              <span class="text-sm font-medium text-gray-900">{{ formatOperator(res.currentHolder) }}</span>
            </span>
          </div>

          <div class="flex justify-between items-center py-2 border-t border-gray-200">
            <span class="text-sm text-gray-500">Active Request</span>
            @if (res.activeRequestStatus) {
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {{ res.activeRequestStatus }}
              </span>
            } @else {
              <span class="text-sm text-gray-500">No active request</span>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class PhoneStatusComponent {
  private readonly portingRequestService = inject(PortingRequestService);
  private readonly toastService = inject(ToastService);

  protected readonly result = signal<PhoneStatusResponseDto | null>(null);
  protected readonly checking = signal(false);
  protected readonly phoneNumberError = PHONE_NUMBER_ERROR;

  protected readonly form = new FormGroup({
    phoneNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(PHONE_NUMBER_PATTERN)]
    })
  });

  protected phoneNumberInvalid(): boolean {
    const control = this.form.controls.phoneNumber;
    return control.touched && control.invalid;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.checking.set(true);
    this.result.set(null);
    const phoneNumber = this.form.controls.phoneNumber.value;

    this.portingRequestService.getPhoneStatus(phoneNumber).subscribe({
      next: (response) => {
        this.result.set(response);
        this.checking.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.checking.set(false);
        const errorBody = err.error as ErrorResponseDto | undefined;
        this.toastService.error(errorBody?.message ?? 'Failed to check phone number status.');
      }
    });
  }

  protected formatOperator(op: string): string {
    return op.charAt(0) + op.slice(1).toLowerCase();
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
}
