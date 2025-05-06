package com.smartcampus.common.response;

import lombok.Data;

import java.io.Serializable;

/**
 * 通用API响应结果封装
 * @param <T> 响应数据的类型
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 状态码 (0 或 200 表示成功)
     */
    private int code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    // --- Constructors ---

    public Result() {}

    public Result(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    // --- Success Methods ---

    public static <T> Result<T> success() {
        return success(null);
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), ResultCode.SUCCESS.getMessage(), data);
    }
     public static <T> Result<T> success(String message, T data) {
        return new Result<>(ResultCode.SUCCESS.getCode(), message, data);
    }


    // --- Failure Methods ---

    public static <T> Result<T> failure(ResultCode resultCode) {
        return new Result<>(resultCode.getCode(), resultCode.getMessage(), null);
    }

    public static <T> Result<T> failure(ResultCode resultCode, String message) {
        return new Result<>(resultCode.getCode(), message, null);
    }
     public static <T> Result<T> failure(int code, String message) {
        return new Result<>(code, message, null);
    }
} 