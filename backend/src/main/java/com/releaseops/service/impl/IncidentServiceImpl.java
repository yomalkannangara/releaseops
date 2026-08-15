package com.releaseops.service.impl;

import com.releaseops.dto.incident.CreateIncidentRequest;
import com.releaseops.dto.incident.IncidentResponse;
import com.releaseops.dto.incident.UpdateIncidentRequest;
import com.releaseops.exception.ResourceNotFoundException;
import com.releaseops.model.AppUser;
import com.releaseops.model.Incident;
import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;
import com.releaseops.model.SoftwareService;
import com.releaseops.repository.AppUserRepository;
import com.releaseops.repository.IncidentRepository;
import com.releaseops.repository.SoftwareServiceRepository;
import com.releaseops.service.IncidentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.releaseops.service.AuditLogService;
import java.util.Map;
import java.time.Instant;

@Service
@Transactional
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final SoftwareServiceRepository serviceRepository;
    private final AppUserRepository appUserRepository;
    private final AuditLogService auditLogService;

    public IncidentServiceImpl(
            IncidentRepository incidentRepository,
            SoftwareServiceRepository serviceRepository,
            AppUserRepository appUserRepository,
            AuditLogService auditLogService) {
        this.incidentRepository = incidentRepository;
        this.serviceRepository = serviceRepository;
        this.appUserRepository = appUserRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    public IncidentResponse createIncident(
            CreateIncidentRequest request) {
        SoftwareService service = serviceRepository
                .findById(request.serviceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service not found with ID: "
                                + request.serviceId()));

        Incident incident = new Incident();
        incident.setService(service);
        incident.setTitle(request.title().trim());
        incident.setDescription(request.description().trim());
        incident.setSeverity(request.severity());
        incident.setStatus(IncidentStatus.OPEN);
        incident.setReportedBy(getCurrentUser());

        Incident savedIncident = incidentRepository.save(incident);
        auditLogService.record(
                "CREATED",
                "INCIDENT",
                savedIncident.getId(),
                Map.of(
                        "serviceId",
                        savedIncident.getService().getId(),
                        "severity",
                        savedIncident.getSeverity().name(),
                        "status",
                        savedIncident.getStatus().name()));
        return toResponse(savedIncident);
    }

    @Override
    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(Long id) {
        return toResponse(findIncident(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IncidentResponse> getIncidents(
            Long serviceId,
            IncidentStatus status,
            IncidentSeverity severity,
            Pageable pageable) {
        return incidentRepository
                .findAllFiltered(
                        serviceId,
                        status,
                        severity,
                        pageable)
                .map(this::toResponse);
    }

    @Override
    public IncidentResponse updateIncident(
            Long id,
            UpdateIncidentRequest request) {
        Incident incident = findIncident(id);
        IncidentStatus previousStatus = incident.getStatus();
        IncidentSeverity previousSeverity = incident.getSeverity();
        if (request.title() != null) {
            incident.setTitle(request.title().trim());
        }

        if (request.description() != null) {
            incident.setDescription(
                    request.description().trim());
        }

        if (request.severity() != null) {
            incident.setSeverity(request.severity());
        }

        if (request.status() != null) {
            updateStatus(incident, request.status());
        }

        Incident updatedIncident = incidentRepository.saveAndFlush(incident);
        auditLogService.record(
                "UPDATED",
                "INCIDENT",
                updatedIncident.getId(),
                Map.of(
                        "previousStatus",
                        previousStatus.name(),
                        "newStatus",
                        updatedIncident.getStatus().name(),
                        "previousSeverity",
                        previousSeverity.name(),
                        "newSeverity",
                        updatedIncident.getSeverity().name()));
        return toResponse(updatedIncident);
    }

    private void updateStatus(
            Incident incident,
            IncidentStatus newStatus) {
        IncidentStatus previousStatus = incident.getStatus();

        incident.setStatus(newStatus);

        if (newStatus == IncidentStatus.RESOLVED
                && previousStatus != IncidentStatus.RESOLVED) {
            incident.setResolvedAt(Instant.now());
        }

        if (newStatus != IncidentStatus.RESOLVED
                && previousStatus == IncidentStatus.RESOLVED) {
            incident.setResolvedAt(null);
        }
    }

    private Incident findIncident(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Incident not found with ID: " + id));
    }

    private AppUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();

        return appUserRepository
                .findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user was not found"));
    }

    private IncidentResponse toResponse(Incident incident) {
        return new IncidentResponse(
                incident.getId(),
                incident.getService().getId(),
                incident.getService().getName(),
                incident.getTitle(),
                incident.getDescription(),
                incident.getSeverity(),
                incident.getStatus(),
                incident.getResolvedAt(),
                incident.getCreatedAt(),
                incident.getUpdatedAt());
    }
}