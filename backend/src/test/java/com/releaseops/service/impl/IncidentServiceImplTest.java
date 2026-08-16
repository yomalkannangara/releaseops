package com.releaseops.service.impl;

import com.releaseops.dto.incident.CreateIncidentRequest;
import com.releaseops.exception.ResourceNotFoundException;
import com.releaseops.model.IncidentSeverity;
import com.releaseops.repository.AppUserRepository;
import com.releaseops.repository.IncidentRepository;
import com.releaseops.repository.SoftwareServiceRepository;
import com.releaseops.service.AuditLogService;
import com.releaseops.service.impl.IncidentServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import com.releaseops.dto.incident.IncidentResponse;
import com.releaseops.dto.incident.UpdateIncidentRequest;
import com.releaseops.model.Incident;
import com.releaseops.model.IncidentStatus;
import com.releaseops.model.SoftwareService;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IncidentServiceImplTest {

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private SoftwareServiceRepository serviceRepository;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private IncidentServiceImpl incidentService;
    @Test
void updateIncidentClearsResolvedTimeWhenIncidentIsReopened() {
    SoftwareService softwareService = new SoftwareService();
    softwareService.setName("ReleaseOps Backend");
    softwareService.setSlug("releaseops-backend");

    Incident incident = new Incident();
    incident.setService(softwareService);
    incident.setTitle("API unavailable");
    incident.setDescription("The API is not responding");
    incident.setSeverity(IncidentSeverity.HIGH);
    incident.setStatus(IncidentStatus.RESOLVED);
    incident.setResolvedAt(Instant.now());

    when(incidentRepository.findById(1L))
            .thenReturn(Optional.of(incident));

    when(incidentRepository.saveAndFlush(any(Incident.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

    UpdateIncidentRequest request =
            new UpdateIncidentRequest(
                    null,
                    null,
                    null,
                    IncidentStatus.MONITORING
            );

    IncidentResponse response =
            incidentService.updateIncident(1L, request);

    assertEquals(IncidentStatus.MONITORING, response.status());
    assertNull(response.resolvedAt());
}
@Test
void updateIncidentSetsResolvedTimeWhenStatusBecomesResolved() {
    SoftwareService softwareService = new SoftwareService();
    softwareService.setName("ReleaseOps Backend");
    softwareService.setSlug("releaseops-backend");

    Incident incident = new Incident();
    incident.setService(softwareService);
    incident.setTitle("API unavailable");
    incident.setDescription("The API is not responding");
    incident.setSeverity(IncidentSeverity.HIGH);
    incident.setStatus(IncidentStatus.OPEN);

    when(incidentRepository.findById(1L))
            .thenReturn(Optional.of(incident));

    when(incidentRepository.saveAndFlush(any(Incident.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

    UpdateIncidentRequest request =
            new UpdateIncidentRequest(
                    null,
                    null,
                    null,
                    IncidentStatus.RESOLVED
            );

    IncidentResponse response =
            incidentService.updateIncident(1L, request);

    assertEquals(IncidentStatus.RESOLVED, response.status());
    assertNotNull(response.resolvedAt());

    verify(auditLogService).record(
            any(),
            any(),
            any(),
            any()
    );
}
    @Test
    void createIncidentThrowsNotFoundWhenServiceDoesNotExist() {
        CreateIncidentRequest request =
                new CreateIncidentRequest(
                        999L,
                        "API unavailable",
                        "The API is not responding",
                        IncidentSeverity.CRITICAL
                );

        when(serviceRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> incidentService.createIncident(request)
        );

        assertEquals(
                "Service not found with ID: 999",
                exception.getMessage()
        );

        verify(incidentRepository, never()).save(any());
        verifyNoInteractions(
                appUserRepository,
                auditLogService
        );
    }
}