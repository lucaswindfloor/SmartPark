package com.smartcampus.api.auth.controller;

import com.smartcampus.api.auth.dto.LoginRequestDTO;
import com.smartcampus.api.auth.dto.LoginResponseDTO;
import com.smartcampus.core.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth") // Matches public endpoint in SecurityConfig
@RequiredArgsConstructor
@Validated // Enable validation for request DTOs
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        log.info("Authentication attempt for user: {}", loginRequest.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            log.info("Authentication successful for user: {}", loginRequest.getUsername());
            return ResponseEntity.ok(new LoginResponseDTO(jwt));
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for user: {}: {}", loginRequest.getUsername(), e.getMessage());
            // Consider returning a more specific error message/code in a real application
            return ResponseEntity.status(401).body("Authentication failed: Invalid credentials");
        }
    }

    // TODO: Add a /register endpoint if needed

} 