package com.ahmedhossam.mnp.exception;

public class SelfPortingNotAllowedException extends RuntimeException {
    public SelfPortingNotAllowedException(String message) {
        super(message);
    }
}
