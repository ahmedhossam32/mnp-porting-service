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
import org.springframework.web.bind.annotation.PathVariable;
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

    @PostMapping("/{id}/accept")
    public ResponseEntity<PortingRequestResponseDto> accept(@PathVariable Long id) {
        Operator caller = operatorContext.getCurrentOperator();
        PortingRequestResponseDto response = service.accept(id, caller);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<PortingRequestResponseDto> reject(@PathVariable Long id) {
        Operator caller = operatorContext.getCurrentOperator();
        PortingRequestResponseDto response = service.reject(id, caller);
        return ResponseEntity.ok(response);
    }
}
