package com.example.leavemanagement.exception;

public class OverlappingLeaveException extends RuntimeException {
    public OverlappingLeaveException(String message) {
        super(message);
    }
}
