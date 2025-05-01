package com.smartcampus.config;

import com.smartcampus.core.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 配置
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Common Swagger paths - replace SecurityConstants.SWAGGER_WHITELIST
    private static final String[] SWAGGER_WHITELIST = {
        "/swagger-ui.html",
        "/swagger-ui/**",
        "/swagger-resources/**",
        "/v2/api-docs", // or /v3/api-docs if using OpenAPI 3
        "/webjars/**",
        "/doc.html" // If using knife4j or similar
    };

    // Define public API endpoints
    private static final String[] PUBLIC_API_ENDPOINTS = {
        "/api/auth/login", // Login endpoint
        "/api/auth/register" // Example: Registration endpoint (if you have one)
        // Add other public endpoints if necessary
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .antMatchers(SWAGGER_WHITELIST).permitAll()
                .antMatchers(PUBLIC_API_ENDPOINTS).permitAll()
                .antMatchers("/api/**").authenticated()
                .anyRequest().permitAll();

        http.formLogin().disable();
        http.httpBasic().disable();

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

} 