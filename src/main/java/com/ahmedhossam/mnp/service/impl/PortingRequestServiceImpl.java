package com.ahmedhossam.mnp.service.impl;

import com.ahmedhossam.mnp.dto.request.CreatePortingRequestDto;
import com.ahmedhossam.mnp.dto.response.PagedResponseDto;
import com.ahmedhossam.mnp.dto.response.PhoneStatusResponseDto;
import com.ahmedhossam.mnp.dto.response.PortingRequestResponseDto;
import com.ahmedhossam.mnp.entity.PortingRequest;
import com.ahmedhossam.mnp.enums.Operator;
import com.ahmedhossam.mnp.enums.PortingRequestStatus;
import com.ahmedhossam.mnp.exception.DuplicatePendingRequestException;
import com.ahmedhossam.mnp.exception.InvalidRequestStateException;
import com.ahmedhossam.mnp.exception.InvisibleToOperatorException;
import com.ahmedhossam.mnp.exception.PortingRequestNotFoundException;
import com.ahmedhossam.mnp.exception.SelfPortingNotAllowedException;
import com.ahmedhossam.mnp.exception.UnauthorizedDonorActionException;
import com.ahmedhossam.mnp.mapper.PortingRequestMapper;
import com.ahmedhossam.mnp.repository.PortingRequestRepository;
import com.ahmedhossam.mnp.service.PhoneHolderResolver;
import com.ahmedhossam.mnp.service.PortingRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Override
    public PortingRequestResponseDto accept(Long id, Operator caller) {
        PortingRequest request = validateDonorActionAndGetRequest(id, caller);
        request.setStatus(PortingRequestStatus.ACCEPTED);
        return mapper.toResponseDto(repository.save(request));
    }

    @Override
    public PortingRequestResponseDto reject(Long id, Operator caller) {
        PortingRequest request = validateDonorActionAndGetRequest(id, caller);
        request.setStatus(PortingRequestStatus.REJECTED);
        return mapper.toResponseDto(repository.save(request));
    }

    @Override
    public PagedResponseDto<PortingRequestResponseDto> list(Operator caller, Pageable pageable) {
        Page<PortingRequestResponseDto> page = repository.findVisibleTo(caller, pageable)
                .map(mapper::toResponseDto);
        return PagedResponseDto.from(page);
    }

    @Override
    public PortingRequestResponseDto getById(Long id, Operator caller) {
        PortingRequest request = repository.findById(id)
                .orElseThrow(() -> new PortingRequestNotFoundException("Porting request not found: " + id));

        boolean involved = request.getRecipientOperator() == caller || request.getDonorOperator() == caller;
        boolean isAccepted = request.getStatus() == PortingRequestStatus.ACCEPTED;

        if (!involved && !isAccepted) {
            throw new InvisibleToOperatorException("Porting request not found: " + id);
        }

        return mapper.toResponseDto(request);
    }

    @Override
    public PhoneStatusResponseDto getPhoneStatus(String phoneNumber) {
        Operator currentHolder = phoneHolderResolver.resolveCurrentHolder(phoneNumber);

        String activeStatus = repository
                .existsByPhoneNumberAndStatus(phoneNumber, PortingRequestStatus.PENDING)
                ? PortingRequestStatus.PENDING.name()
                : null;

        return PhoneStatusResponseDto.builder()
                .phoneNumber(phoneNumber)
                .currentHolder(currentHolder.name())
                .activeRequestStatus(activeStatus)
                .build();
    }

    private PortingRequest validateDonorActionAndGetRequest(Long id, Operator caller) {
        PortingRequest request = repository.findById(id)
                .orElseThrow(() -> new PortingRequestNotFoundException("Porting request not found: " + id));

        if (request.getDonorOperator() != caller) {
            throw new UnauthorizedDonorActionException("Only the donor can accept or reject this request");
        }

        if (request.getStatus() != PortingRequestStatus.PENDING) {
            throw new InvalidRequestStateException("Request is no longer pending: " + request.getStatus());
        }

        return request;
    }
}
