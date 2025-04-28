package com.smartcampus.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc OpenAPI 3 配置 (Minimal Prototype)
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartCampus API (Minimal Prototype)")
                        .version("1.0.0")
                        .description("Smart Campus Management System API Documentation - Focused on Announcement Module")
                        .contact(new Contact().name("SmartCampus Team").url("https://www.smartcampus.com").email("info@smartcampus.com")));
    }

    @Bean
    public GroupedOpenApi announcementApi() {
        // Group specifically for the Announcement module in the comprehensive platform
        return GroupedOpenApi.builder()
                .group("1-Comprehensive-Announcement") // Group name for organization in Swagger UI
                .packagesToScan("com.smartcampus.platform.comprehensive.servicemanagement.informationdisclosure.controller.announcement") // Updated package path
                // .pathsToMatch("/api/comprehensive/servicemanagement/informationdisclosure/announcement/**") // Alternative: Match by path
                .build();
    }

    // TODO: Add other GroupedOpenApi beans for other modules as they are implemented
    /*
    @Bean
    public GroupedOpenApi otherComprehensiveApi() {
        return GroupedOpenApi.builder()
                .group("2-Comprehensive-Other")
                .packagesToScan("com.smartcampus.platform.comprehensive.*") // Adjust package
                .packagesToExclude("com.smartcampus.platform.comprehensive.servicemanagement.informationdisclosure.controller.announcement") // Updated package path
                .build();
    }
    */

    // TODO: Add beans for public and admin platforms later

} 