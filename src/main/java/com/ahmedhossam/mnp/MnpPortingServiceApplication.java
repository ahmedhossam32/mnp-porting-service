package com.ahmedhossam.mnp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MnpPortingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MnpPortingServiceApplication.class, args);
    }
}
