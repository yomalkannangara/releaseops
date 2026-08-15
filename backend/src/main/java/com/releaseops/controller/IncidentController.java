package com.releaseops.controller;

import com.releaseops.dto.incident.CreateIncidentRequest;
import com.releaseops.dto.incident.IncidentResponse;
import com.releaseops.dto.incident.UpdateIncidentRequest;
import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;
import com.releaseops.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ENGINEER')")
    public ResponseEntity<IncidentResponse> createIncident(
            @Valid @RequestBody CreateIncidentRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(incidentService.createIncident(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                incidentService.getIncidentById(id)
        );
    }

    @GetMapping
    public ResponseEntity<Page<IncidentResponse>> getIncidents(
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) IncidentSeverity severity,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                incidentService.getIncidents(
                        serviceId,
                        status,
                        severity,
                        pageable
                )
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENGINEER')")
    public ResponseEntity<IncidentResponse> updateIncident(
            @PathVariable Long id,
            @Valid @RequestBody UpdateIncidentRequest request
    ) {
        return ResponseEntity.ok(
                incidentService.updateIncident(id, request)
        );
    }
}