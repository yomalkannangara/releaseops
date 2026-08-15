package com.releaseops.dto.deployment;

import com.releaseops.model.DeploymentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record UpdateDeploymentRequest(

        @NotNull(message = "Deployment status is required")
        DeploymentStatus status,

        @PositiveOrZero(
                message = "Duration must be zero or greater"
        )
        Integer durationSeconds,

        @Size(
                max = 10000,
                message = "Failure reason cannot exceed 10000 characters"
        )
        String failureReason

) {
}