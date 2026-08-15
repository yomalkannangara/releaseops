package com.releaseops.dto.deployment;

import com.releaseops.model.DeploymentEnvironment;
import com.releaseops.model.DeploymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateDeploymentRequest(

        @NotNull(message = "Service ID is required")
        Long serviceId,

        @NotBlank(message = "Version is required")
        @Size(max = 100, message = "Version cannot exceed 100 characters")
        String version,

        @NotBlank(message = "Commit SHA is required")
        @Pattern(
                regexp = "^[a-fA-F0-9]{7,64}$",
                message = "Commit SHA must contain 7–64 hexadecimal characters"
        )
        String commitSha,

        @NotNull(message = "Deployment environment is required")
        DeploymentEnvironment environment,

        @NotNull(message = "Deployment status is required")
        DeploymentStatus status,

        @Size(max = 500, message = "Pipeline URL cannot exceed 500 characters")
        String pipelineUrl

) {
}