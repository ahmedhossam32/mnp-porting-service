package com.ahmedhossam.mnp.service.impl;

import com.ahmedhossam.mnp.dto.request.CreatePortingRequestDto;
import com.ahmedhossam.mnp.dto.response.PortingRequestResponseDto;
import com.ahmedhossam.mnp.entity.PortingRequest;
import com.ahmedhossam.mnp.enums.Operator;
import com.ahmedhossam.mnp.enums.PortingRequestStatus;
import com.ahmedhossam.mnp.exception.DuplicatePendingRequestException;
import com.ahmedhossam.mnp.exception.SelfPortingNotAllowedException;
import com.ahmedhossam.mnp.mapper.PortingRequestMapper;
import com.ahmedhossam.mnp.repository.PortingRequestRepository;
import com.ahmedhossam.mnp.service.PhoneHolderResolver;
import com.ahmedhossam.mnp.service.PortingRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PortingRequestServiceImpl implements PortingRequestService {

    private final PortingRequestRepository repository;
    private final PhoneHolderResolver phoneHolderResolver;
    private final PortingRequestMapper mapper;

    @Override
    public PortingRequestResponseDto create(CreatePortingRequestDto dto, Operator recipient) {
        Operator donor = phoneHolderResolver.resolveCurrentHolder(dto.getPhoneNumber());

        if (donor == recipient) {
            throw new SelfPortingNotAllowedException(
                    "Operator " + recipient + " cannot port a number away from itself");
        }

        if (repository.existsByPhoneNumberAndStatus(dto.getPhoneNumber(), PortingRequestStatus.PENDING)) {
            throw new DuplicatePendingRequestException(
                    "Phone number " + dto.getPhoneNumber() + " already has a pending porting request");
        }

        PortingRequest entity = mapper.toEntity(dto, recipient, donor);
        PortingRequest saved = repository.save(entity);

        return mapper.toResponseDto(saved);
    }
}
