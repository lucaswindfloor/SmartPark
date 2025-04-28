package com.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring Web MVC 配置 (Minimal Prototype)
 */
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configures Cross-Origin Resource Sharing (CORS) settings.
     * Allows requests from any origin for development purposes.
     * TODO: Restrict origins for production environments.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply CORS to all paths
                .allowedOrigins("*") // Allow all origins (adjust for production)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(false) // Credentials not typically needed for basic CORS
                .maxAge(3600); // Cache preflight response for 1 hour
    }

    // Add other web configurations here if needed, e.g., message converters, interceptors
    // For example, Spring Boot usually auto-configures Jackson JSON message converters.
    // If specific customization is needed, configure HttpMessageConverters here.
} 