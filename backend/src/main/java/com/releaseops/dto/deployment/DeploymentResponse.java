package com.releaseops.dto.deployment;

import com.releaseops.model.DeploymentEnvironment;
import com.releaseops.model.DeploymentStatus;

import java.time.Instant;

public record DeploymentResponse(
        Long id,
        Long serviceId,
        String serviceName,
        String version,
        String commitSha,
        DeploymentEnvironment environment,
        DeploymentStatus status,
        String triggeredBy,
        Integer durationSeconds,
        String pipelineUrl,
        String failureReason,
        Instant deployedAt,
        Instant createdAt,
        Instant updatedAt
) {
}