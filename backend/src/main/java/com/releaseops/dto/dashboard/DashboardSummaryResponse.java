package com.releaseops.dto.dashboard;

import com.releaseops.dto.deployment.DeploymentResponse;

import java.util.List;

public record DashboardSummaryResponse(
        long totalServices,
        long healthyServices,
        long openIncidents,
        long criticalIncidents,
        long deploymentsToday,
        long failedDeploymentsToday,
        List<DeploymentResponse> recentDeployments
) {
}