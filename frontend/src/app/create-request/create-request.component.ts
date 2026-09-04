import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PortingRequestService } from '../core/services/porting-request.service';
import { ToastService } from '../core/services/toast.service';
import { ErrorResponseDto } from '../models/error-response.model';

const PHONE_NUMBER_PATTERN = /^0[0-9]{10}$/;
const PHONE_NUMBER_ERROR = 'Phone number must be 11 digits starting with 0';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto mt-12 bg-white rounded-xl shadow p-10">
      <div class="flex flex-col items-center text-center mb-6">
        <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900">New Porting Request</h2>
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
          [disabled]="submitting()"
          class="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          @if (submitting()) {
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span>Submitting...</span>
          } @else {
            <span>Submit Request</span>
          }
        </button>
      </form>
    </div>
  `
})
export class CreateRequestComponent {
  private readonly portingRequestService = inject(PortingRequestService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
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

    this.submitting.set(true);
    const phoneNumber = this.form.controls.phoneNumber.value;

    this.portingRequestService.create({ phoneNumber }).subscribe({
      next: (response) => {
        this.submitting.set(false);
        this.toastService.success(
          `Porting request #${response.id} submitted — porting from ${this.formatOperator(response.donorOperator)}, now awaiting their approval.`,
          {
            label: 'View Requests',
            onClick: () => this.router.navigate(['/requests'])
          }
        );
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        const errorBody = err.error as ErrorResponseDto | undefined;
        this.toastService.error(errorBody?.message ?? 'Failed to create porting request. Please try again.');
      }
    });
  }

  private formatOperator(op: string): string {
    return op.charAt(0) + op.slice(1).toLowerCase();
  }
}
