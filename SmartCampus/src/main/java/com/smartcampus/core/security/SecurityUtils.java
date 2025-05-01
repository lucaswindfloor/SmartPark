package com.smartcampus.core.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Set;

/**
 * Utility class for Spring Security.
 */
public final class SecurityUtils {

    private SecurityUtils() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Get the username of the current user.
     *
     * @return the username of the current user or Optional.empty() if not authenticated.
     */
    public static Optional<String> getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        String username = null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            username = (String) principal;
        }

        // Handle anonymous user explicitly if configured
        if ("anonymousUser".equals(username)) {
            return Optional.empty();
        }

        return Optional.ofNullable(username);
    }

    /**
     * Get the authorities of the current user.
     *
     * @return a set of authorities (permission strings) or an empty set if not authenticated.
     */
    public static Set<String> getCurrentUserAuthorities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptySet();
        }
        
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        if (authorities == null) {
            return Collections.emptySet();
        }
        
        return authorities.stream()
                          .map(GrantedAuthority::getAuthority)
                          .collect(Collectors.toSet());
    }
    
    /**
     * Check if the current user has a specific authority (permission).
     *
     * @param authority the authority string to check for (e.g., "announcement:manage")
     * @return true if the user has the authority, false otherwise.
     */
    public static boolean hasCurrentUserAuthority(String authority) {
        return getCurrentUserAuthorities().contains(authority);
    }

} 