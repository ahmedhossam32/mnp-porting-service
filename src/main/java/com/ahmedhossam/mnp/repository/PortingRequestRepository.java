package com.ahmedhossam.mnp.repository;

import com.ahmedhossam.mnp.entity.PortingRequest;
import com.ahmedhossam.mnp.enums.PortingRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortingRequestRepository extends JpaRepository<PortingRequest, Long> {

    Optional<PortingRequest> findFirstByPhoneNumberAndStatusOrderByUpdatedAtDesc(
            String phoneNumber, PortingRequestStatus status);

    boolean existsByPhoneNumberAndStatus(String phoneNumber, PortingRequestStatus status);
}
