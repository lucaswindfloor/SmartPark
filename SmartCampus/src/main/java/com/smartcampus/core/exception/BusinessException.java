package com.smartcampus.core.exception;

import com.smartcampus.common.response.ResultCode;
import lombok.Getter;

/**
 * 自定义业务异常基类
 */
@Getter
public class BusinessException extends RuntimeException {

    private final ResultCode resultCode;

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.resultCode = resultCode;
    }

    public BusinessException(ResultCode resultCode, String message) {
        super(message);
        this.resultCode = resultCode;
    }

    public BusinessException(String message) {
        super(message);
        this.resultCode = ResultCode.FAILURE; // Default code or choose another
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.resultCode = ResultCode.FAILURE;
    }
} 