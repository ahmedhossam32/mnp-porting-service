import { Component, computed, inject } from '@angular/core';
import { OperatorContextService } from '../core/services/operator-context.service';
import { OPERATORS, Operator } from '../models/operator.model';

@Component({
  selector: 'app-operator-selector',
  standalone: true,
  template: `
    <div class="flex items-center gap-2">
      <span class="text-xs text-indigo-100 hidden sm:inline">Acting as</span>
      <div class="relative">
        <select
          [value]="operatorContext.currentOperator()"
          (change)="onOperatorChange($event)"
          [class]="selectClasses()"
        >
          @for (op of operators; track op) {
            <option [value]="op">{{ formatOperator(op) }}</option>
          }
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  `
})
export class OperatorSelectorComponent {
  protected readonly operatorContext = inject(OperatorContextService);
  protected readonly operators = OPERATORS;

  private readonly colorMap: Record<Operator, string> = {
    VODAFONE: 'bg-red-50 border-red-500 text-red-700 focus:ring-red-500',
    ORANGE: 'bg-orange-50 border-orange-500 text-orange-700 focus:ring-orange-500',
    ETISALAT: 'bg-emerald-50 border-emerald-500 text-emerald-700 focus:ring-emerald-500'
  };

  protected readonly selectClasses = computed(() => {
    const base = 'appearance-none border-2 rounded-lg pl-3 pr-9 py-2 text-sm font-bold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1';
    return `${base} ${this.colorMap[this.operatorContext.currentOperator()]}`;
  });

  protected formatOperator(op: Operator): string {
    return op.charAt(0) + op.slice(1).toLowerCase();
  }

  protected onOperatorChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Operator;
    this.operatorContext.setCurrentOperator(value);
  }
}
