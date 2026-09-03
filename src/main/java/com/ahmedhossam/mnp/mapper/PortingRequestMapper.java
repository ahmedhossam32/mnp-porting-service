package com.ahmedhossam.mnp.mapper;

import com.ahmedhossam.mnp.dto.request.CreatePortingRequestDto;
import com.ahmedhossam.mnp.dto.response.PortingRequestResponseDto;
import com.ahmedhossam.mnp.entity.PortingRequest;
import com.ahmedhossam.mnp.enums.Operator;
import com.ahmedhossam.mnp.enums.PortingRequestStatus;
import org.springframework.stereotype.Component;

@Component
public class PortingRequestMapper {

    public PortingRequest toEntity(CreatePortingRequestDto dto, Operator recipient, Operator donor) {
        return PortingRequest.builder()
                .phoneNumber(dto.getPhoneNumber())
                .recipientOperator(recipient)
                .donorOperator(donor)
                .status(PortingRequestStatus.PENDING)
                .build();
    }

    public PortingRequestResponseDto toResponseDto(PortingRequest entity) {
        return PortingRequestResponseDto.builder()
                .id(entity.getId())
                .phoneNumber(entity.getPhoneNumber())
                .recipientOperator(entity.getRecipientOperator().name())
                .donorOperator(entity.getDonorOperator().name())
                .status(entity.getStatus().name())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
