package com.ahmedhossam.mnp.config;

import com.ahmedhossam.mnp.security.OperatorContext;
import com.ahmedhossam.mnp.security.OperatorInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final OperatorContext operatorContext;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new OperatorInterceptor(operatorContext));
    }
}
