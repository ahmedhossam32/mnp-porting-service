package com.ahmedhossam.mnp.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreatePortingRequestDto {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^0\\d{10}$", message = "Phone number must be 11 digits starting with 0")
    private String phoneNumber;
}
