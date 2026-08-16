package com.releaseops.service.impl;

import com.releaseops.dto.service.CreateServiceRequest;
import com.releaseops.exception.DuplicateResourceException;
import com.releaseops.repository.SoftwareServiceRepository;
import com.releaseops.service.AuditLogService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.ArgumentMatchers.eq;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import com.releaseops.dto.service.ServiceResponse;
import com.releaseops.model.ServiceStatus;
import com.releaseops.model.SoftwareService;
import com.releaseops.exception.ResourceNotFoundException;

import java.util.Optional;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class SoftwareServiceServiceImplTest {
    @Test
void deleteServiceDeletesAndAuditsExistingService() {
    SoftwareService existingService = new SoftwareService();
    existingService.setName("Legacy API");
    existingService.setSlug("legacy-api");

    when(serviceRepository.findById(1L))
            .thenReturn(Optional.of(existingService));

    service.deleteService(1L);

    verify(serviceRepository).delete(existingService);

    verify(auditLogService).record(
            eq("DELETED"),
            eq("SERVICE"),
            eq(1L),
            any()
    );
}
    @Test
    void getServiceThrowsNotFoundWhenIdDoesNotExist() {
        when(serviceRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> service.getServiceById(999L));

        assertEquals(
                "Service not found with ID: 999",
                exception.getMessage());

        verify(serviceRepository).findById(999L);
        verifyNoInteractions(auditLogService);
    }

    @Test
    void createServiceSavesAndAuditsNewService() {
        CreateServiceRequest request = new CreateServiceRequest(
                "Payment API",
                "payment-api",
                "Processes payments",
                "https://github.com/example/payment-api",
                "https://payment.example.com");

        when(serviceRepository.save(any(SoftwareService.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ServiceResponse response = service.createService(request);

        assertEquals("Payment API", response.name());
        assertEquals("payment-api", response.slug());
        assertEquals(ServiceStatus.HEALTHY, response.status());

        verify(serviceRepository, times(1))
                .save(any(SoftwareService.class));

        verify(auditLogService, times(1)).record(
                any(),
                any(),
                any(),
                any());
    }

    @Mock
    private SoftwareServiceRepository serviceRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private SoftwareServiceServiceImpl service;

    @Test
    void createServiceThrowsConflictWhenSlugAlreadyExists() {
        CreateServiceRequest request = new CreateServiceRequest(
                "ReleaseOps API",
                "releaseops-api",
                null,
                null,
                null);

        when(serviceRepository.existsBySlug("releaseops-api"))
                .thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> service.createService(request));

        verify(serviceRepository, never()).save(any());
        verify(auditLogService, never()).record(
                any(),
                any(),
                any(),
                any());
    }
}