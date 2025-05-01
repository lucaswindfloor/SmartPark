package com.smartcampus.core.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User; // Use Spring Security's User
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret}") // Load from application.yml
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}") // Load from application.yml
    private int jwtExpirationMs;

    private Key key;

    @PostConstruct
    public void init() {
        // Ensure the secret is strong enough for HS512
        if (jwtSecret == null || jwtSecret.length() < 64) {
             log.warn("JWT secret is not configured or too short. Using a default generated key. Configure app.jwt.secret with a strong, base64 encoded key in application.yml");
             this.key = Keys.secretKeyFor(SignatureAlgorithm.HS512); // Generate a secure key if not configured
         } else {
            try {
                byte[] keyBytes = java.util.Base64.getDecoder().decode(jwtSecret);
                this.key = Keys.hmacShaKeyFor(keyBytes);
            } catch (IllegalArgumentException e) {
                 log.error("Invalid Base64 encoded JWT secret key in configuration. Using a default generated key.", e);
                 this.key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            }
        }
    }

    public String generateToken(Authentication authentication) {
        User userPrincipal = (User) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .claim("auth", authorities) // Include authorities in the token
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        } catch (SignatureException ex) {
            log.error("JWT signature does not match locally computed signature.");
        }
        return false;
    }
} 