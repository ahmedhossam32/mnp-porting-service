package com.ahmedhossam.mnp.security;

import com.ahmedhossam.mnp.enums.Operator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
public class OperatorInterceptor implements HandlerInterceptor {

    private final OperatorContext operatorContext;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        String headerValue = request.getHeader("organization");
        operatorContext.setCurrentOperator(Operator.fromHeaderValue(headerValue));
        return true;
    }
}
