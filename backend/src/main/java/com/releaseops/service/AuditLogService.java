package com.releaseops.service;

import com.releaseops.dto.audit.AuditLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AuditLogService {

    void record(
            String action,
            String entityType,
            Long entityId,
            Map<String, Object> details
    );

    Page<AuditLogResponse> getAuditLogs(
            Long actorId,
            String entityType,
            String action,
            Pageable pageable
    );
}