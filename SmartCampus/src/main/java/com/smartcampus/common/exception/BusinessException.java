package com.smartcampus.common.exception;

/**
 * Base exception for custom business logic errors.
 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 1L; // Recommended for Serializable classes

    private Integer code; // Optional: for specific error codes

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(Integer code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }
} 