package com.releaseops.dto.deployment;

import com.releaseops.model.DeploymentEnvironment;
import com.releaseops.model.DeploymentStatus;

import java.time.LocalDateTime;

public record DeploymentResponse(
        Long id,
        Long serviceId,
        String serviceName,
        String version,
        String commitSha,
        DeploymentEnvironment environment,
        DeploymentStatus status,
        String pipelineUrl,
        LocalDateTime deployedAt,
        LocalDateTime createdAt
) {
}