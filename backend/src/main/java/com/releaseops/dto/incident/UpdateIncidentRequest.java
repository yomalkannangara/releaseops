package com.releaseops.dto.incident;

import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;
import jakarta.validation.constraints.Size;

public record UpdateIncidentRequest(

        @Size(min = 1, max = 200, message = "Incident title must contain 1–200 characters")
        String title,

        @Size(min = 1, max = 10000, message = "Incident description must contain 1–10000 characters")
        String description,

        IncidentSeverity severity,

        IncidentStatus status

) {
}