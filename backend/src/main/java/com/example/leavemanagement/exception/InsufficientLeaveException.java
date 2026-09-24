package com.example.leavemanagement.exception;

public class InsufficientLeaveException extends RuntimeException {
    public InsufficientLeaveException(String message) {
        super(message);
    }
}
