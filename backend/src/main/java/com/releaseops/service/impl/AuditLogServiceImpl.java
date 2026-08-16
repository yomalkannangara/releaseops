package com.releaseops.service.impl;

import com.releaseops.dto.audit.AuditLogResponse;
import com.releaseops.model.AppUser;
import com.releaseops.model.AuditLog;
import com.releaseops.repository.AppUserRepository;
import com.releaseops.repository.AuditLogRepository;
import com.releaseops.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@Service
@Transactional
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AppUserRepository appUserRepository;

    public AuditLogServiceImpl(
            AuditLogRepository auditLogRepository,
            AppUserRepository appUserRepository) {
        this.auditLogRepository = auditLogRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public void record(
            String action,
            String entityType,
            Long entityId,
            Map<String, Object> details) {
        AuditLog auditLog = new AuditLog();

        auditLog.setActor(getCurrentUser());
        auditLog.setAction(normalize(action));
        auditLog.setEntityType(normalize(entityType));
        auditLog.setEntityId(entityId);
        auditLog.setDetails(
                details == null
                        ? new LinkedHashMap<>()
                        : new LinkedHashMap<>(details));
        auditLog.setIpAddress(getCurrentIpAddress());

        auditLogRepository.save(auditLog);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> getAuditLogs(
            Long actorId,
            String entityType,
            String action,
            Pageable pageable) {
        return auditLogRepository
                .findAllFiltered(
                        actorId,
                        normalizeNullable(entityType),
                        normalizeNullable(action),
                        pageable)
                .map(this::toResponse);
    }

    private String normalizeNullable(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return normalize(value);
    }

    private AppUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(
                        authentication.getName())) {
            return null;
        }

        return appUserRepository
                .findByEmailIgnoreCase(
                        authentication.getName())
                .orElse(null);
    }

    private String getCurrentIpAddress() {
        if (!(RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes)) {
            return null;
        }

        HttpServletRequest request = attributes.getRequest();

        String forwardedFor = request.getHeader("X-Forwarded-For");

        if (forwardedFor != null
                && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private String normalize(String value) {
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private AuditLogResponse toResponse(AuditLog auditLog) {
        AppUser actor = auditLog.getActor();

        return new AuditLogResponse(
                auditLog.getId(),
                actor == null ? null : actor.getId(),
                actor == null ? null : actor.getEmail(),
                auditLog.getAction(),
                auditLog.getEntityType(),
                auditLog.getEntityId(),
                auditLog.getDetails(),
                auditLog.getIpAddress(),
                auditLog.getCreatedAt());
    }
}