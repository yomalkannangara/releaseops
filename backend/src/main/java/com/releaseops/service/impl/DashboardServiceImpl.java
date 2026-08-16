package com.releaseops.service.impl;

import com.releaseops.dto.dashboard.DashboardSummaryResponse;
import com.releaseops.model.DeploymentStatus;
import com.releaseops.model.IncidentSeverity;
import com.releaseops.model.IncidentStatus;
import com.releaseops.model.ServiceStatus;
import com.releaseops.repository.DeploymentRepository;
import com.releaseops.repository.IncidentRepository;
import com.releaseops.repository.SoftwareServiceRepository;
import com.releaseops.service.DashboardService;
import com.releaseops.service.DeploymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final SoftwareServiceRepository serviceRepository;
    private final IncidentRepository incidentRepository;
    private final DeploymentRepository deploymentRepository;
    private final DeploymentService deploymentService;

    public DashboardServiceImpl(
            SoftwareServiceRepository serviceRepository,
            IncidentRepository incidentRepository,
            DeploymentRepository deploymentRepository,
            DeploymentService deploymentService) {
        this.serviceRepository = serviceRepository;
        this.incidentRepository = incidentRepository;
        this.deploymentRepository = deploymentRepository;
        this.deploymentService = deploymentService;
    }

    @Override
    public DashboardSummaryResponse getSummary() {
        ZoneId applicationZone = ZoneId.systemDefault();

        Instant startOfToday = LocalDate.now(applicationZone)
                .atStartOfDay(applicationZone)
                .toInstant();
        return new DashboardSummaryResponse(
                serviceRepository.count(),
                serviceRepository.countByStatus(ServiceStatus.HEALTHY),
                incidentRepository.countByStatusNot(
                        IncidentStatus.RESOLVED),
                incidentRepository.countBySeverityAndStatusNot(
                        IncidentSeverity.CRITICAL,
                        IncidentStatus.RESOLVED),
                deploymentRepository
                        .countByDeployedAtGreaterThanEqual(startOfToday),
                deploymentRepository
                        .countByStatusAndDeployedAtGreaterThanEqual(
                                DeploymentStatus.FAILED,
                                startOfToday),
                deploymentService.getRecentDeployments());
    }
}