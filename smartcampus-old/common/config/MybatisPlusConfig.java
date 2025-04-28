package com.smartcampus.common.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * MyBatis-Plus配置
 */
@Configuration
@EnableTransactionManagement
@MapperScan("com.smartcampus.infrastructure.persistence.mapper")
public class MybatisPlusConfig {

    /**
     * 分页插件
     */
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }

    /**
     * MyBatis-Plus分页插件
     */
    public static class PaginationInterceptor {
        // 此处只是一个占位示例，实际项目中应当引入MyBatis-Plus依赖后使用真实的分页插件
    }
} 