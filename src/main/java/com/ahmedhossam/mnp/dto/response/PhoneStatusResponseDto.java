package com.ahmedhossam.mnp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PhoneStatusResponseDto {
    private String phoneNumber;
    private String currentHolder;
    private String activeRequestStatus;
}
