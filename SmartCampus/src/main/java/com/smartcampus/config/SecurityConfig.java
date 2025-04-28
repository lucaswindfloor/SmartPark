package com.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 配置 (Minimal Prototype)
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    // Common Swagger paths - replace SecurityConstants.SWAGGER_WHITELIST
    private static final String[] SWAGGER_WHITELIST = {
        "/swagger-ui.html",
        "/swagger-ui/**",
        "/swagger-resources/**",
        "/v2/api-docs", // or /v3/api-docs if using OpenAPI 3
        "/webjars/**",
        "/doc.html" // If using knife4j or similar
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            // Use STATELESS session policy for token-based authentication
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
                .antMatchers(SWAGGER_WHITELIST).permitAll() // Allow access to Swagger UI
                // TODO: Add other public endpoints here (e.g., login, registration)
                // Example: .antMatchers("/api/auth/login", "/api/auth/register").permitAll()
                
                // Secure the announcement module API endpoints (Example - adjust path if needed)
                // .antMatchers("/platform/comprehensive/servicemanagement/informationdisclosure/announcements/**").authenticated()
                
                // For minimal startup, permit all other requests temporarily
                // Revert this to .anyRequest().authenticated() when auth is implemented
                .anyRequest().permitAll(); // TEMPORARY: Permit all for initial startup

        // Disable default form login and basic authentication
        http.formLogin().disable();
        http.httpBasic().disable();

        // TODO: Add JWT filter chain configuration here
        // http.addFilterBefore(jwtAuthenticationTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // TODO: Define JwtAuthenticationTokenFilter bean
    /*
    @Bean
    public JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter() {
        return new JwtAuthenticationTokenFilter();
    }
    */

} 