package com.releaseops.dto.user;

import com.releaseops.model.Role;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(

        @Size(min = 1, max = 120, message = "Full name must contain 1–120 characters")
        String fullName,

        Role role,

        Boolean enabled

) {
}