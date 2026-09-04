package com.ahmedhossam.mnp.controller;

import com.ahmedhossam.mnp.dto.request.PhoneNumberValidation;
import com.ahmedhossam.mnp.dto.response.PhoneStatusResponseDto;
import com.ahmedhossam.mnp.service.PortingRequestService;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/phone-numbers")
@RequiredArgsConstructor
@Validated
public class PhoneNumberController {

    private final PortingRequestService service;

    @GetMapping("/{phoneNumber}/status")
    public ResponseEntity<PhoneStatusResponseDto> getStatus(
            @PathVariable
            @Pattern(regexp = PhoneNumberValidation.PATTERN, message = PhoneNumberValidation.MESSAGE)
            String phoneNumber) {
        return ResponseEntity.ok(service.getPhoneStatus(phoneNumber));
    }
}
