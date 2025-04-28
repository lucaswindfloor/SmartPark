package com.smartcampus.common.exception;

import com.smartcampus.common.response.ResultCode;

/**
 * 业务异常，用于处理应用程序特定的业务错误
 */
public class BusinessException extends BaseException {
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(Integer code, String message) {
        super(code, message);
    }
    
    public BusinessException(ResultCode resultCode) {
        super(resultCode);
    }
    
    public BusinessException(ResultCode resultCode, String message) {
        super(resultCode, message);
    }
    
    public BusinessException(ResultCode resultCode, Throwable cause) {
        super(resultCode, cause);
    }
} 