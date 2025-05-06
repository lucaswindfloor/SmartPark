package com.smartcampus.api.auth.controller;

import com.smartcampus.api.auth.dto.LoginRequestDTO;
import com.smartcampus.api.auth.dto.LoginResponseDTO;
import com.smartcampus.api.auth.dto.UserProfileDTO;
import com.smartcampus.common.response.Result;
import com.smartcampus.common.response.ResultCode;
import com.smartcampus.core.security.JwtTokenProvider;
import com.smartcampus.infrastructure.persistence.mysql.entity.UserPO;
import com.smartcampus.infrastructure.persistence.mysql.mapper.security.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<Result<?>> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
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

            LoginResponseDTO loginResponse = new LoginResponseDTO(jwt);
            return ResponseEntity.ok(Result.success(loginResponse));

        } catch (AuthenticationException e) {
            log.warn("Authentication failed for user: {}: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(ResultCode.UNAUTHORIZED.getCode())
                    .body(Result.failure(ResultCode.UNAUTHORIZED, "Authentication failed: Invalid credentials"));
        }
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Result<UserProfileDTO>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof User)) {
            log.warn("Cannot get current user. Authentication is invalid or principal is not User.");
            return ResponseEntity.status(ResultCode.UNAUTHORIZED.getCode())
                    .body(Result.failure(ResultCode.UNAUTHORIZED, "User not authenticated"));
        }

        User userPrincipal = (User) authentication.getPrincipal();
        String username = userPrincipal.getUsername();

        UserPO userPO = userMapper.findByUsername(username);
        if (userPO == null) {
            log.error("Authenticated user '{}' not found in database for /me endpoint!", username);
            throw new UsernameNotFoundException("User details not found for authenticated user: " + username);
        }

        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .map(auth -> auth.substring(5))
                .collect(Collectors.toSet());

        Set<String> permissions = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> !auth.startsWith("ROLE_"))
                .collect(Collectors.toSet());

        UserProfileDTO userProfile = new UserProfileDTO(
                userPO.getId(),
                userPO.getUsername(),
                roles,
                permissions,
                userPO.getNickname(),
                userPO.getEmail(),
                userPO.getAvatar()
        );

        log.info("Fetched profile for user: {}", username);
        return ResponseEntity.ok(Result.success(userProfile));
    }

    // TODO: Add a /register endpoint if needed

} 