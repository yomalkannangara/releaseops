package com.releaseops.dto.user;

import com.releaseops.model.Role;

import java.time.Instant;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        Role role,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt
) {
}