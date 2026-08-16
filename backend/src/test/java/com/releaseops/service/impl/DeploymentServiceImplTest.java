package com.releaseops.service.impl;

import com.releaseops.dto.deployment.DeploymentResponse;
import com.releaseops.dto.deployment.UpdateDeploymentRequest;
import com.releaseops.model.Deployment;
import com.releaseops.model.DeploymentEnvironment;
import com.releaseops.model.DeploymentStatus;
import com.releaseops.model.SoftwareService;
import com.releaseops.repository.DeploymentRepository;
import com.releaseops.repository.SoftwareServiceRepository;
import com.releaseops.service.AuditLogService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import com.releaseops.exception.ResourceNotFoundException;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verifyNoInteractions;
@ExtendWith(MockitoExtension.class)
class DeploymentServiceImplTest {

    @Mock
    private DeploymentRepository deploymentRepository;

    @Mock
    private SoftwareServiceRepository serviceRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private DeploymentServiceImpl deploymentService;
@Test
void updateDeploymentThrowsNotFoundWhenIdDoesNotExist() {
    when(deploymentRepository.findById(999L))
            .thenReturn(Optional.empty());

    UpdateDeploymentRequest request =
            new UpdateDeploymentRequest(
                    DeploymentStatus.FAILED,
                    50,
                    "Health check failed"
            );

    ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> deploymentService.updateDeployment(999L, request)
    );

    assertEquals(
            "Deployment not found with ID: 999",
            exception.getMessage()
    );

    verify(deploymentRepository, never())
            .saveAndFlush(any());

    verifyNoInteractions(auditLogService);
}
    @Test
    void successfulDeploymentClearsPreviousFailureReason() {
        SoftwareService softwareService = new SoftwareService();
        softwareService.setName("ReleaseOps Backend");
        softwareService.setSlug("releaseops-backend");

        Deployment deployment = new Deployment();
        deployment.setService(softwareService);
        deployment.setVersion("v1.0.0");
        deployment.setCommitSha("abc1234");
        deployment.setEnvironment(DeploymentEnvironment.STAGING);
        deployment.setStatus(DeploymentStatus.FAILED);
        deployment.setFailureReason("Health check failed");

        when(deploymentRepository.findById(1L))
                .thenReturn(Optional.of(deployment));

        when(deploymentRepository.saveAndFlush(
                any(Deployment.class)
        )).thenAnswer(
                invocation -> invocation.getArgument(0)
        );

        UpdateDeploymentRequest request =
                new UpdateDeploymentRequest(
                        DeploymentStatus.SUCCESS,
                        84,
                        null
                );

        DeploymentResponse response =
                deploymentService.updateDeployment(1L, request);

        assertEquals(DeploymentStatus.SUCCESS, response.status());
        assertEquals(84, response.durationSeconds());
        assertNull(response.failureReason());

        verify(auditLogService).record(
                any(),
                any(),
                any(),
                any()
        );
    }
}