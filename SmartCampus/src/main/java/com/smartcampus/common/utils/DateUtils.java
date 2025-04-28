package com.smartcampus.common.utils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 日期时间工具类
 */
public final class DateUtils {

    private DateUtils() {
        // Private constructor
    }

    public static final String DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final DateTimeFormatter DEFAULT_FORMATTER = DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT);

    /**
     * 格式化LocalDateTime为字符串
     * @param dateTime LocalDateTime实例
     * @return 格式化后的字符串
     */
    public static String format(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DEFAULT_FORMATTER);
    }

    /**
     * 格式化LocalDateTime为字符串
     * @param dateTime LocalDateTime实例
     * @param pattern 格式模式
     * @return 格式化后的字符串
     */
    public static String format(LocalDateTime dateTime, String pattern) {
        if (dateTime == null || pattern == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ofPattern(pattern));
    }

    /**
     * 解析字符串为LocalDateTime
     * @param dateTimeStr 日期时间字符串
     * @return LocalDateTime实例
     */
    public static LocalDateTime parse(String dateTimeStr) {
        if (dateTimeStr == null) {
            return null;
        }
        return LocalDateTime.parse(dateTimeStr, DEFAULT_FORMATTER);
    }

    /**
     * 解析字符串为LocalDateTime
     * @param dateTimeStr 日期时间字符串
     * @param pattern 格式模式
     * @return LocalDateTime实例
     */
    public static LocalDateTime parse(String dateTimeStr, String pattern) {
        if (dateTimeStr == null || pattern == null) {
            return null;
        }
        return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ofPattern(pattern));
    }

    // Add other common date/time utility methods

} 