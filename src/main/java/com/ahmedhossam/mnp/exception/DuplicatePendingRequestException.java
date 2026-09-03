package com.ahmedhossam.mnp.exception;

public class DuplicatePendingRequestException extends RuntimeException {
    public DuplicatePendingRequestException(String message) {
        super(message);
    }
}
