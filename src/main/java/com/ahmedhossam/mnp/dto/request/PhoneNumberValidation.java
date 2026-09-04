package com.ahmedhossam.mnp.dto.request;

public final class PhoneNumberValidation {
    public static final String PATTERN = "^0[0-9]{10}$";
    public static final String MESSAGE = "Phone number must be 11 digits starting with 0";

    private PhoneNumberValidation() {
    }
}
