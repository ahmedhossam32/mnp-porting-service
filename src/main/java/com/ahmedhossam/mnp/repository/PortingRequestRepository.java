package com.ahmedhossam.mnp.repository;

import com.ahmedhossam.mnp.entity.PortingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PortingRequestRepository extends JpaRepository<PortingRequest, Long> {
}
