package com.releaseops.repository;

import com.releaseops.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long> {

    @Query("""
            SELECT audit
            FROM AuditLog audit
            WHERE (:actorId IS NULL
                    OR audit.actor.id = :actorId)
              AND (:entityType IS NULL
                    OR LOWER(audit.entityType)
                        = LOWER(:entityType))
              AND (:action IS NULL
                    OR LOWER(audit.action)
                        = LOWER(:action))
            """)
    Page<AuditLog> findAllFiltered(
            @Param("actorId") Long actorId,
            @Param("entityType") String entityType,
            @Param("action") String action,
            Pageable pageable
    );
}