package com.ahmedhossam.mnp.controller;

import com.ahmedhossam.mnp.dto.request.CreatePortingRequestDto;
import com.ahmedhossam.mnp.dto.response.PortingRequestResponseDto;
import com.ahmedhossam.mnp.enums.Operator;
import com.ahmedhossam.mnp.security.OperatorContext;
import com.ahmedhossam.mnp.service.PortingRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/porting-requests")
@RequiredArgsConstructor
public class PortingRequestController {

    private final PortingRequestService service;
    private final OperatorContext operatorContext;

    @PostMapping
    public ResponseEntity<PortingRequestResponseDto> create(@Valid @RequestBody CreatePortingRequestDto dto) {
        Operator recipient = operatorContext.getCurrentOperator();
        PortingRequestResponseDto response = service.create(dto, recipient);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
