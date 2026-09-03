package com.ahmedhossam.mnp.service;

import com.ahmedhossam.mnp.dto.request.CreatePortingRequestDto;
import com.ahmedhossam.mnp.dto.response.PortingRequestResponseDto;
import com.ahmedhossam.mnp.enums.Operator;

public interface PortingRequestService {
    PortingRequestResponseDto create(CreatePortingRequestDto dto, Operator recipient);
}
