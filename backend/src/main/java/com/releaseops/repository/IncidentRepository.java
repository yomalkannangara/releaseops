package com.releaseops.repository;

import com.releaseops.model.Incident;
import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IncidentRepository
        extends JpaRepository<Incident, Long> {

    @Query("""
            SELECT incident
            FROM Incident incident
            WHERE (:serviceId IS NULL
                    OR incident.service.id = :serviceId)
              AND (:status IS NULL
                    OR incident.status = :status)
              AND (:severity IS NULL
                    OR incident.severity = :severity)
            """)
    Page<Incident> findAllFiltered(
            @Param("serviceId") Long serviceId,
            @Param("status") IncidentStatus status,
            @Param("severity") IncidentSeverity severity,
            Pageable pageable
    );
}