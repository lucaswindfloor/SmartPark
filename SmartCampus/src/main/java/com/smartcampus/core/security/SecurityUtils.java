package com.smartcampus.core.security;

// Placeholder for security-related utilities or components
// e.g., JWT utils, password encoders, context holders

public class SecurityUtils {

    private SecurityUtils() {}

    // Example: Get current user ID (needs actual implementation using Spring Security Context)
    public static Long getCurrentUserId() {
        // TODO: Implement logic to get user ID from SecurityContextHolder
        // For now, returning a placeholder or null
        return 1L; // Placeholder
    }

    // Example: Get current username
    public static String getCurrentUsername() {
        // TODO: Implement logic to get username
        return "currentUser"; // Placeholder
    }
} 