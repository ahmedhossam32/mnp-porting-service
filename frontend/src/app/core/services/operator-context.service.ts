import { Injectable, signal } from '@angular/core';
import { Operator } from '../../models/operator.model';

@Injectable({ providedIn: 'root' })
export class OperatorContextService {
  private readonly currentOperatorSignal = signal<Operator>('VODAFONE');

  readonly currentOperator = this.currentOperatorSignal.asReadonly();

  setCurrentOperator(operator: Operator): void {
    this.currentOperatorSignal.set(operator);
  }
}
