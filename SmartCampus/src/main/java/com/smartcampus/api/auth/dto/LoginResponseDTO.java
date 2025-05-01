package com.smartcampus.api.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String accessToken;
    private String tokenType = "Bearer";

    public LoginResponseDTO(String accessToken) {
        this.accessToken = accessToken;
    }
} 