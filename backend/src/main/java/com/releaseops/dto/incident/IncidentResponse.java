package com.releaseops.dto.incident;

import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;

import java.time.LocalDateTime;

public record IncidentResponse(
        Long id,
        Long serviceId,
        String serviceName,
        String title,
        String description,
        IncidentSeverity severity,
        IncidentStatus status,
        LocalDateTime resolvedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}