package com.releaseops.dto.audit;

import java.time.LocalDateTime;

public record AuditLogResponse(
        Long id,
        Long actorId,
        String actorEmail,
        String action,
        String entityType,
        Long entityId,
        String details,
        LocalDateTime createdAt
) {
}