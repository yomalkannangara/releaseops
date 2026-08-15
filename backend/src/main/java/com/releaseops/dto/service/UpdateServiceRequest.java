package com.releaseops.dto.service;

import com.releaseops.model.ServiceStatus;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateServiceRequest(

        @Size(min = 1, max = 120, message = "Service name must contain 1–120 characters")
        String name,

        @Size(min = 1, max = 120, message = "Service slug must contain 1–120 characters")
        @Pattern(
                regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "Slug must use lowercase letters, numbers and hyphens"
        )
        String slug,

        @Size(max = 5000, message = "Description cannot exceed 5000 characters")
        String description,

        @Size(max = 500, message = "Repository URL cannot exceed 500 characters")
        String repositoryUrl,

        @Size(max = 500, message = "Production URL cannot exceed 500 characters")
        String productionUrl,

        ServiceStatus status

) {
}