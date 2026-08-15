package com.releaseops.dto.auth;

import com.releaseops.model.Role;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresIn,
        Long userId,
        String email,
        String fullName,
        Role role
) {
}