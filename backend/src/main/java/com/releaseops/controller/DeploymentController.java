package com.releaseops.controller;

import com.releaseops.dto.deployment.CreateDeploymentRequest;
import com.releaseops.dto.deployment.DeploymentResponse;
import com.releaseops.dto.deployment.UpdateDeploymentRequest;
import com.releaseops.model.DeploymentEnvironment;
import com.releaseops.model.DeploymentStatus;
import com.releaseops.service.DeploymentService;
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
@RequestMapping("/api/deployments")
public class DeploymentController {

    private final DeploymentService deploymentService;

    public DeploymentController(
            DeploymentService deploymentService
    ) {
        this.deploymentService = deploymentService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ENGINEER')")
    public ResponseEntity<DeploymentResponse> createDeployment(
            @Valid @RequestBody CreateDeploymentRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        deploymentService.createDeployment(request)
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeploymentResponse> getDeploymentById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                deploymentService.getDeploymentById(id)
        );
    }

    @GetMapping
    public ResponseEntity<Page<DeploymentResponse>> getDeployments(
            @RequestParam(required = false) Long serviceId,
            @RequestParam(required = false) DeploymentStatus status,
            @RequestParam(required = false)
            DeploymentEnvironment environment,
            @PageableDefault(
                    size = 20,
                    sort = "deployedAt",
                    direction = Sort.Direction.DESC
            )
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                deploymentService.getDeployments(
                        serviceId,
                        status,
                        environment,
                        pageable
                )
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENGINEER')")
    public ResponseEntity<DeploymentResponse> updateDeployment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDeploymentRequest request
    ) {
        return ResponseEntity.ok(
                deploymentService.updateDeployment(id, request)
        );
    }
}