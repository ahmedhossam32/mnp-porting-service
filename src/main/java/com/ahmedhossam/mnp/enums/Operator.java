package com.ahmedhossam.mnp.enums;

public enum Operator {

    VODAFONE("vodafone", 1_000_000_000L, 1_099_999_999L),
    ORANGE("orange", 1_200_000_000L, 1_299_999_999L),
    ETISALAT("etisalat", 1_100_000_000L, 1_199_999_999L);

    private final String headerValue;
    private final long rangeStart;
    private final long rangeEnd;

    Operator(String headerValue, long rangeStart, long rangeEnd) {
        this.headerValue = headerValue;
        this.rangeStart = rangeStart;
        this.rangeEnd = rangeEnd;
    }

    public String getHeaderValue() {
        return headerValue;
    }

    public static Operator fromHeaderValue(String headerValue) {
        if (headerValue == null) {
            throw new IllegalArgumentException("Missing organization header value");
        }
        for (Operator operator : values()) {
            if (operator.headerValue.equalsIgnoreCase(headerValue.trim())) {
                return operator;
            }
        }
        throw new IllegalArgumentException("Unknown organization header value: " + headerValue);
    }

    public static Operator resolveByRange(String phoneNumber) {
        long numeric = parseNumeric(phoneNumber);
        for (Operator operator : values()) {
            if (numeric >= operator.rangeStart && numeric <= operator.rangeEnd) {
                return operator;
            }
        }
        throw new IllegalArgumentException("Phone number does not belong to any known operator range: " + phoneNumber);
    }

    private static long parseNumeric(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) {
            throw new IllegalArgumentException("Phone number must not be blank");
        }
        try {
            return Long.parseLong(phoneNumber.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Phone number must be numeric: " + phoneNumber);
        }
    }
}
