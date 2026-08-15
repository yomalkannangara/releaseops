package com.releaseops.dto.incident;

import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;

import java.time.Instant;

public record IncidentResponse(
        Long id,
        Long serviceId,
        String serviceName,
        String title,
        String description,
        IncidentSeverity severity,
        IncidentStatus status,
        Instant resolvedAt,
        Instant createdAt,
        Instant updatedAt
) {
}