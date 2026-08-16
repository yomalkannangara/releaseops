package com.releaseops.service.impl;

import com.releaseops.dto.deployment.CreateDeploymentRequest;
import com.releaseops.dto.deployment.DeploymentResponse;
import com.releaseops.dto.deployment.UpdateDeploymentRequest;
import com.releaseops.exception.ResourceNotFoundException;
import com.releaseops.model.Deployment;
import com.releaseops.model.DeploymentEnvironment;
import com.releaseops.model.DeploymentStatus;
import com.releaseops.model.SoftwareService;
import com.releaseops.repository.DeploymentRepository;
import com.releaseops.repository.SoftwareServiceRepository;
import com.releaseops.service.DeploymentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.releaseops.service.AuditLogService;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Locale;
import java.util.List;

@Service
@Transactional
public class DeploymentServiceImpl implements DeploymentService {

    private final DeploymentRepository deploymentRepository;
    private final SoftwareServiceRepository serviceRepository;
    private final AuditLogService auditLogService;

    public DeploymentServiceImpl(
            DeploymentRepository deploymentRepository,
            SoftwareServiceRepository serviceRepository,
            AuditLogService auditLogService) {
        this.deploymentRepository = deploymentRepository;
        this.serviceRepository = serviceRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    public DeploymentResponse createDeployment(
            CreateDeploymentRequest request) {
        SoftwareService service = serviceRepository
                .findById(request.serviceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service not found with ID: "
                                + request.serviceId()));

        Deployment deployment = new Deployment();
        deployment.setService(service);
        deployment.setVersion(request.version().trim());
        deployment.setCommitSha(
                request.commitSha()
                        .trim()
                        .toLowerCase(Locale.ROOT));
        deployment.setEnvironment(request.environment());
        deployment.setStatus(request.status());
        deployment.setTriggeredBy(
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName());

        if (request.pipelineUrl() != null) {
            deployment.setPipelineRunUrl(
                    request.pipelineUrl().trim());
        }

        Deployment savedDeployment = deploymentRepository.save(deployment);

        auditLogService.record(
                "CREATED",
                "DEPLOYMENT",
                savedDeployment.getId(),
                Map.of(
                        "version", savedDeployment.getVersion(),
                        "environment",
                        savedDeployment.getEnvironment().name(),
                        "status",
                        savedDeployment.getStatus().name()));
        return toResponse(savedDeployment);
    }

    @Override
    @Transactional(readOnly = true)
    public DeploymentResponse getDeploymentById(Long id) {
        return toResponse(findDeployment(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DeploymentResponse> getDeployments(
            Long serviceId,
            DeploymentStatus status,
            DeploymentEnvironment environment,
            Pageable pageable) {
        return deploymentRepository
                .findAllFiltered(
                        serviceId,
                        status,
                        environment,
                        pageable)
                .map(this::toResponse);
    }

    @Override
    public DeploymentResponse updateDeployment(
            Long id,
            UpdateDeploymentRequest request) {
        Deployment deployment = findDeployment(id);
        DeploymentStatus previousStatus = deployment.getStatus();
        deployment.setStatus(request.status());

        if (request.durationSeconds() != null) {
            deployment.setDurationSeconds(
                    request.durationSeconds());
        }

        if (request.failureReason() != null) {
            deployment.setFailureReason(
                    request.failureReason().trim());
        }

        if (request.status() == DeploymentStatus.SUCCESS) {
            deployment.setFailureReason(null);
        }

        Deployment updatedDeployment = deploymentRepository.saveAndFlush(deployment);
        Map<String, Object> auditDetails = new LinkedHashMap<>();

        auditDetails.put(
                "previousStatus",
                previousStatus.name());
        auditDetails.put(
                "newStatus",
                updatedDeployment.getStatus().name());
        auditDetails.put(
                "version",
                updatedDeployment.getVersion());

        if (updatedDeployment.getDurationSeconds() != null) {
            auditDetails.put(
                    "durationSeconds",
                    updatedDeployment.getDurationSeconds());
        }

        if (updatedDeployment.getFailureReason() != null) {
            auditDetails.put(
                    "failureReason",
                    updatedDeployment.getFailureReason());
        }

        auditLogService.record(
                "STATUS_UPDATED",
                "DEPLOYMENT",
                updatedDeployment.getId(),
                auditDetails);
        return toResponse(updatedDeployment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeploymentResponse> getRecentDeployments() {
        return deploymentRepository
                .findTop5ByOrderByDeployedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Deployment findDeployment(Long id) {
        return deploymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Deployment not found with ID: " + id));
    }

    private DeploymentResponse toResponse(
            Deployment deployment) {
        return new DeploymentResponse(
                deployment.getId(),
                deployment.getService().getId(),
                deployment.getService().getName(),
                deployment.getVersion(),
                deployment.getCommitSha(),
                deployment.getEnvironment(),
                deployment.getStatus(),
                deployment.getTriggeredBy(),
                deployment.getDurationSeconds(),
                deployment.getPipelineRunUrl(),
                deployment.getFailureReason(),
                deployment.getDeployedAt(),
                deployment.getCreatedAt(),
                deployment.getUpdatedAt());
    }
}