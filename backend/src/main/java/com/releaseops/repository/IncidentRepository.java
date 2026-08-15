package com.releaseops.repository;

import com.releaseops.model.Incident;
import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

    Page<Incident> findByService_Id(Long serviceId, Pageable pageable);

    Page<Incident> findByStatus(
            IncidentStatus status,
            Pageable pageable
    );

    Page<Incident> findBySeverity(
            IncidentSeverity severity,
            Pageable pageable
    );
}