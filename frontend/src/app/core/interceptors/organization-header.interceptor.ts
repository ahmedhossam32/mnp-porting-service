import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OperatorContextService } from '../services/operator-context.service';

export const organizationHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const operatorContext = inject(OperatorContextService);
  const currentOperator = operatorContext.currentOperator();

  const clonedRequest = req.clone({
    setHeaders: {
      organization: currentOperator.toLowerCase()
    }
  });

  return next(clonedRequest);
};
