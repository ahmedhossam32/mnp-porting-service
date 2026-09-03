package com.ahmedhossam.mnp.security;

import com.ahmedhossam.mnp.enums.Operator;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class OperatorContext {

    private Operator currentOperator;

    public Operator getCurrentOperator() {
        return currentOperator;
    }

    public void setCurrentOperator(Operator currentOperator) {
        this.currentOperator = currentOperator;
    }
}
