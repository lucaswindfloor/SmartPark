package com.smartcampus;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderUtil { // 或任何临时类
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(); // 默认强度与 Spring Security 匹配
        String plainPassword = "password";
        String hashedPassword = encoder.encode(plainPassword);
        System.out.println("BCrypt hash for '" + plainPassword + "': " + hashedPassword);
    }
}
