package com.smartcampus.core.exception;

import com.smartcampus.common.response.Result;
import com.smartcampus.common.response.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 */
@Slf4j
@RestControllerAdvice // Catches exceptions from @RestController classes
public class GlobalExceptionHandler {

    /**
     * 处理自定义业务异常
     */
    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.OK) // Or another appropriate status like BAD_REQUEST
    public Result<Void> handleBusinessException(BusinessException ex) {
        log.error("Business Exception: {}", ex.getMessage(), ex);
        return Result.error(ex.getResultCode(), ex.getMessage());
    }

    /**
     * 处理其他未捕获的异常
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Result<Void> handleException(Exception ex) {
        log.error("Unhandled Exception: {}", ex.getMessage(), ex);
        // Avoid exposing internal details in production
        return Result.error(ResultCode.INTERNAL_SERVER_ERROR.getCode(), "系统内部错误，请联系管理员");
    }

    // Add handlers for specific exceptions like BindException, MethodArgumentNotValidException, etc.

} 