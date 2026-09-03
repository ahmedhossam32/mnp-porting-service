package com.ahmedhossam.mnp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortingRequestResponseDto {
    private Long id;
    private String phoneNumber;
    private String recipientOperator;
    private String donorOperator;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
