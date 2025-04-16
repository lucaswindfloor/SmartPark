package com.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

/**
 * 智慧园区应用程序启动类
 */
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class SmartCampusApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
    }
} 