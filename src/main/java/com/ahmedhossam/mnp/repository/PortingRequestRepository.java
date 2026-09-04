package com.ahmedhossam.mnp.repository;

import com.ahmedhossam.mnp.entity.PortingRequest;
import com.ahmedhossam.mnp.enums.Operator;
import com.ahmedhossam.mnp.enums.PortingRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortingRequestRepository extends JpaRepository<PortingRequest, Long> {

    Optional<PortingRequest> findFirstByPhoneNumberAndStatusOrderByUpdatedAtDesc(
            String phoneNumber, PortingRequestStatus status);

    boolean existsByPhoneNumberAndStatus(String phoneNumber, PortingRequestStatus status);

    @Query("SELECT pr FROM PortingRequest pr WHERE " +
           "pr.recipientOperator = :caller OR pr.donorOperator = :caller OR pr.status = 'ACCEPTED' " +
           "ORDER BY pr.createdAt DESC, pr.id DESC")
    Page<PortingRequest> findVisibleTo(@Param("caller") Operator caller, Pageable pageable);
}
