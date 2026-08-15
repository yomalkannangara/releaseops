package com.releaseops.service;

import com.releaseops.dto.incident.CreateIncidentRequest;
import com.releaseops.dto.incident.IncidentResponse;
import com.releaseops.dto.incident.UpdateIncidentRequest;
import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IncidentService {

    IncidentResponse createIncident(
            CreateIncidentRequest request
    );

    IncidentResponse getIncidentById(Long id);

    Page<IncidentResponse> getIncidents(
            Long serviceId,
            IncidentStatus status,
            IncidentSeverity severity,
            Pageable pageable
    );

    IncidentResponse updateIncident(
            Long id,
            UpdateIncidentRequest request
    );
}