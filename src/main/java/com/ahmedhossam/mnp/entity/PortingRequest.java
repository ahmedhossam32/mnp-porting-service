package com.ahmedhossam.mnp.entity;

import com.ahmedhossam.mnp.enums.Operator;
import com.ahmedhossam.mnp.enums.PortingRequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "porting_request",
       indexes = @Index(name = "idx_porting_request_phone_status", columnList = "phone_number, status"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PortingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_number", nullable = false, length = 11)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "recipient_operator", nullable = false, length = 20)
    private Operator recipientOperator;

    @Enumerated(EnumType.STRING)
    @Column(name = "donor_operator", nullable = false, length = 20)
    private Operator donorOperator;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PortingRequestStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
