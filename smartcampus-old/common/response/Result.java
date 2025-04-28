package com.smartcampus.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 统一API响应结果封装
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer code;
    private String message;
    private T data;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * 成功返回结果
     *
     * @param data 获取的数据
     */
    public static <T> Result<T> success(T data) {
        return Result.<T>builder()
                .code(ResultCode.SUCCESS.getCode())
                .message(ResultCode.SUCCESS.getMessage())
                .data(data)
                .build();
    }

    /**
     * 成功返回结果
     *
     * @param data 获取的数据
     * @param message 提示信息
     */
    public static <T> Result<T> success(String message, T data) {
        return Result.<T>builder()
                .code(ResultCode.SUCCESS.getCode())
                .message(message)
                .data(data)
                .build();
    }

    /**
     * 失败返回结果
     *
     * @param code 错误码
     * @param message 错误信息
     */
    public static <T> Result<T> error(Integer code, String message) {
        return Result.<T>builder()
                .code(code)
                .message(message)
                .build();
    }

    /**
     * 失败返回结果
     *
     * @param resultCode 错误码
     */
    public static <T> Result<T> error(ResultCode resultCode) {
        return Result.<T>builder()
                .code(resultCode.getCode())
                .message(resultCode.getMessage())
                .build();
    }
    
    /**
     * 失败返回结果
     *
     * @param code 错误码
     * @param message 错误信息
     * @param data 数据
     */
    public static <T> Result<T> error(Integer code, String message, T data) {
        return Result.<T>builder()
                .code(code)
                .message(message)
                .data(data)
                .build();
    }
    
    /**
     * 失败返回结果
     *
     * @param resultCode 错误码
     * @param data 数据
     */
    public static <T> Result<T> error(ResultCode resultCode, T data) {
        return Result.<T>builder()
                .code(resultCode.getCode())
                .message(resultCode.getMessage())
                .data(data)
                .build();
    }
} 