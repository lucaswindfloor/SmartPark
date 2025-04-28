package com.smartcampus.common.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

/**
 * 分页查询结果封装
 * @param <T> the type parameter
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 当前页码
     */
    private Long page;

    /**
     * 每页数量
     */
    private Long pageSize;

    /**
     * 总记录数
     */
    private Long total;

    /**
     * 总页数
     */
    private Long pages;

    /**
     * 当前页数据列表
     */
    private List<T> items;

    /**
     * 创建分页结果对象
     *
     * @param page     当前页码
     * @param pageSize 每页数量
     * @param total    总记录数
     * @param items    当前页数据列表
     * @return 分页结果
     * @param <T>      数据类型
     */
    public static <T> PageResult<T> create(Long page, Long pageSize, Long total, List<T> items) {
        Long pages = (total == null || total == 0 || pageSize == null || pageSize == 0) ? 0 : (total + pageSize - 1) / pageSize;
        return new PageResult<>(page, pageSize, total, pages, items);
    }
} 