package com.ahmedhossam.mnp.service.impl;

import com.ahmedhossam.mnp.entity.PortingRequest;
import com.ahmedhossam.mnp.enums.Operator;
import com.ahmedhossam.mnp.enums.PortingRequestStatus;
import com.ahmedhossam.mnp.repository.PortingRequestRepository;
import com.ahmedhossam.mnp.service.PhoneHolderResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PhoneHolderResolverImpl implements PhoneHolderResolver {

    private final PortingRequestRepository repository;

    @Override
    public Operator resolveCurrentHolder(String phoneNumber) {
        Optional<PortingRequest> lastAccepted = repository
                .findFirstByPhoneNumberAndStatusOrderByUpdatedAtDesc(phoneNumber, PortingRequestStatus.ACCEPTED);

        return lastAccepted
                .map(PortingRequest::getRecipientOperator)
                .orElseGet(() -> Operator.resolveByRange(phoneNumber));
    }
}
