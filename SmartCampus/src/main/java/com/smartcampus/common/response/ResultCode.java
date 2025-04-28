package com.smartcampus.common.response;

import lombok.Getter;

/**
 * Standard result codes for API responses
 */
@Getter
public enum ResultCode {
    
    // Success codes (200-299)
    SUCCESS(200, "Operation successful"),
    CREATED(201, "Resource created successfully"),
    
    // Client error codes (400-499)
    BAD_REQUEST(400, "Bad request"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Access denied"),
    NOT_FOUND(404, "Resource not found"),
    METHOD_NOT_ALLOWED(405, "Method not allowed"),
    CONFLICT(409, "Resource conflict"),
    VALIDATION_ERROR(422, "Validation error"),
    PARAM_ERROR(400, "Parameter error"),
    
    // Server error codes (500-599)
    INTERNAL_SERVER_ERROR(500, "Internal server error"),
    SERVICE_UNAVAILABLE(503, "Service unavailable"),
    
    // --- General Failure --- 
    FAILURE(500, "操作失败"), // Added generic failure
    
    // Business error codes (1000+)
    NOTIFICATION_SEND_FAILED(1001, "Failed to send notification"),
    NOTIFICATION_NOT_FOUND(1002, "Notification not found"),
    RECIPIENT_NOT_FOUND(1003, "Recipient not found");
    
    private final Integer code;
    private final String message;
    
    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
} 