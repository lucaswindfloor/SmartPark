package com.smartcampus.api.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

/**
 * DTO for returning authenticated user profile information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String username;
    // Use Set to avoid duplicate roles/permissions if fetched from multiple joins
    private Set<String> roles; 
    private Set<String> permissions;
    // Add any other necessary user details (e.g., nickname, email)
    private String nickname;
    private String email;
    private String avatar;

} 