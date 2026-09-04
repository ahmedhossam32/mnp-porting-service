package com.ahmedhossam.mnp.service;

import com.ahmedhossam.mnp.dto.request.CreatePortingRequestDto;
import com.ahmedhossam.mnp.dto.response.PagedResponseDto;
import com.ahmedhossam.mnp.dto.response.PortingRequestResponseDto;
import com.ahmedhossam.mnp.enums.Operator;
import org.springframework.data.domain.Pageable;

public interface PortingRequestService {
    PortingRequestResponseDto create(CreatePortingRequestDto dto, Operator recipient);
    PortingRequestResponseDto accept(Long id, Operator caller);
    PortingRequestResponseDto reject(Long id, Operator caller);
    PagedResponseDto<PortingRequestResponseDto> list(Operator caller, Pageable pageable);
}
