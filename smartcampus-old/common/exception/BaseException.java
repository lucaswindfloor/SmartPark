package com.smartcampus.common.exception;

import com.smartcampus.common.response.ResultCode;
import lombok.Getter;

/**
 * 基础异常类，所有自定义异常的父类
 */
@Getter
public abstract class BaseException extends RuntimeException {
    
    private final Integer code;
    
    public BaseException(String message) {
        super(message);
        this.code = ResultCode.INTERNAL_SERVER_ERROR.getCode();
    }
    
    public BaseException(Integer code, String message) {
        super(message);
        this.code = code;
    }
    
    public BaseException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
    }
    
    public BaseException(ResultCode resultCode, String message) {
        super(message);
        this.code = resultCode.getCode();
    }
    
    public BaseException(ResultCode resultCode, Throwable cause) {
        super(resultCode.getMessage(), cause);
        this.code = resultCode.getCode();
    }
} 