package com.smartcampus.api.auth.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class LoginRequestDTO {

    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;
} 