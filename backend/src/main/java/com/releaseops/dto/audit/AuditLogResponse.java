package com.releaseops.dto.audit;

import java.time.Instant;
import java.util.Map;

public record AuditLogResponse(
        Long id,
        Long actorId,
        String actorEmail,
        String action,
        String entityType,
        Long entityId,
        Map<String, Object> details,
        String ipAddress,
        Instant createdAt
) {
}