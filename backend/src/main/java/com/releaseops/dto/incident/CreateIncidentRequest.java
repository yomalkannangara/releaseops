package com.releaseops.dto.incident;

import com.releaseops.model.IncidentSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateIncidentRequest(

        @NotNull(message = "Service ID is required")
        Long serviceId,

        @NotBlank(message = "Incident title is required")
        @Size(max = 200, message = "Incident title cannot exceed 200 characters")
        String title,

        @NotBlank(message = "Incident description is required")
        @Size(max = 10000, message = "Incident description cannot exceed 10000 characters")
        String description,

        @NotNull(message = "Incident severity is required")
        IncidentSeverity severity

) {
}