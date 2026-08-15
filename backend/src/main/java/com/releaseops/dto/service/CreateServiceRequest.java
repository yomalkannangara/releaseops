package com.releaseops.dto.service;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateServiceRequest(

        @NotBlank(message = "Service name is required")
        @Size(max = 120, message = "Service name cannot exceed 120 characters")
        String name,

        @NotBlank(message = "Service slug is required")
        @Size(max = 120, message = "Service slug cannot exceed 120 characters")
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
        String productionUrl

) {
}