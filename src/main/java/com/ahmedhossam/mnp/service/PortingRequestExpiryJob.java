package com.ahmedhossam.mnp.service;

import com.ahmedhossam.mnp.entity.PortingRequest;
import com.ahmedhossam.mnp.enums.PortingRequestStatus;
import com.ahmedhossam.mnp.repository.PortingRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PortingRequestExpiryJob {

    private final PortingRequestRepository repository;

    @Value("${mnp.porting.request-timeout-minutes}")
    private long timeoutMinutes;

    @Scheduled(cron = "${mnp.porting.expiry-check-cron}")
    public void cancelExpiredPendingRequests() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(timeoutMinutes);

        List<PortingRequest> expired = repository
                .findByStatusAndCreatedAtBefore(PortingRequestStatus.PENDING, cutoff);

        if (expired.isEmpty()) {
            return;
        }

        expired.forEach(request -> request.setStatus(PortingRequestStatus.CANCELED));
        repository.saveAll(expired);

        log.info("Canceled {} expired pending porting request(s)", expired.size());
    }
}
