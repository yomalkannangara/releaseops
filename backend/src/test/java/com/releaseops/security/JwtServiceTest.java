package com.releaseops.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        String secret =
                "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=";

        jwtService = new JwtService(secret, 3_600_000L);
    }

    @Test
    void generatedTokenContainsUserEmailAndIsValid() {
        UserDetails user = User.withUsername(
                        "admin@releaseops.local"
                )
                .password("unused")
                .roles("ADMIN")
                .build();

        String token = jwtService.generateToken(user);

        assertEquals(
                "admin@releaseops.local",
                jwtService.extractEmail(token)
        );
        assertTrue(jwtService.isTokenValid(token, user));
        assertEquals(3600L, jwtService.getExpirationSeconds());
    }

    @Test
    void tokenIsInvalidForDifferentUser() {
        UserDetails originalUser = User.withUsername(
                        "admin@releaseops.local"
                )
                .password("unused")
                .roles("ADMIN")
                .build();

        UserDetails differentUser = User.withUsername(
                        "engineer@releaseops.local"
                )
                .password("unused")
                .roles("ENGINEER")
                .build();

        String token = jwtService.generateToken(originalUser);

        assertFalse(
                jwtService.isTokenValid(token, differentUser)
        );
    }
}