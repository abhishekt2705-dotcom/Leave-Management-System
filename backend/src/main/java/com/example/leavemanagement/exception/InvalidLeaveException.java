package com.example.leavemanagement.exception;

public class InvalidLeaveException extends RuntimeException {
    public InvalidLeaveException(String message) {
        super(message);
    }
}
