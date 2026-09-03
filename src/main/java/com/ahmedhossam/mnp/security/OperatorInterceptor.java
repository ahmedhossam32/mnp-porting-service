package com.ahmedhossam.mnp.security;

import com.ahmedhossam.mnp.enums.Operator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class OperatorInterceptor implements HandlerInterceptor {

    private final OperatorContext operatorContext;

    public OperatorInterceptor(OperatorContext operatorContext) {
        this.operatorContext = operatorContext;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String headerValue = request.getHeader("organization");
        operatorContext.setCurrentOperator(Operator.fromHeaderValue(headerValue));
        return true;
    }
}
