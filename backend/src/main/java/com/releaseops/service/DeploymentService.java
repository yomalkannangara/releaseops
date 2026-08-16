package com.releaseops.service;

import com.releaseops.dto.deployment.CreateDeploymentRequest;
import com.releaseops.dto.deployment.DeploymentResponse;
import com.releaseops.dto.deployment.UpdateDeploymentRequest;
import com.releaseops.model.DeploymentEnvironment;
import com.releaseops.model.DeploymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface DeploymentService {

    DeploymentResponse createDeployment(
            CreateDeploymentRequest request);

    DeploymentResponse getDeploymentById(Long id);

    List<DeploymentResponse> getRecentDeployments();

    Page<DeploymentResponse> getDeployments(
            Long serviceId,
            DeploymentStatus status,
            DeploymentEnvironment environment,
            Pageable pageable);

    DeploymentResponse updateDeployment(
            Long id,
            UpdateDeploymentRequest request);
}