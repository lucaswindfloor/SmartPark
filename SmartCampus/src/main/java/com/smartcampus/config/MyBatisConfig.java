package com.smartcampus.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * MyBatis Plus Configuration
 */
@Configuration
@EnableTransactionManagement // Optional: Enable declarative transaction management
@MapperScan("com.smartcampus.infrastructure.persistence.mysql.mapper.**") // Scan for mapper interfaces
public class MyBatisConfig {

    /**
     * Configures the MyBatis Plus Interceptor chain, including pagination.
     * @return MybatisPlusInterceptor bean
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // Add the pagination interceptor
        // Specify your database type (e.g., DbType.MYSQL, DbType.POSTGRE_SQL)
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }

    // Optional: Configure MetaObjectHandler for automatic field filling (createTime, etc.)
    // @Bean
    // public MetaObjectHandler metaObjectHandler() {
    //     return new MyMetaObjectHandler(); // Create this class
    // }

} 