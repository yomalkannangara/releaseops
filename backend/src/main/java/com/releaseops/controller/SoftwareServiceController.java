package com.releaseops.controller;

import com.releaseops.dto.service.CreateServiceRequest;
import com.releaseops.dto.service.ServiceResponse;
import com.releaseops.dto.service.UpdateServiceRequest;
import com.releaseops.model.ServiceStatus;
import com.releaseops.service.SoftwareServiceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/services")
public class SoftwareServiceController {

    private final SoftwareServiceService softwareServiceService;

    public SoftwareServiceController(
            SoftwareServiceService softwareServiceService
    ) {
        this.softwareServiceService = softwareServiceService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ENGINEER')")
    public ResponseEntity<ServiceResponse> createService(
            @Valid @RequestBody CreateServiceRequest request
    ) {
        ServiceResponse response =
                softwareServiceService.createService(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                softwareServiceService.getServiceById(id)
        );
    }

    @GetMapping
    public ResponseEntity<Page<ServiceResponse>> getServices(
            @RequestParam(required = false) ServiceStatus status,
            @PageableDefault(size = 20, sort = "name")
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                softwareServiceService.getServices(status, pageable)
        );
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENGINEER')")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable Long id,
            @Valid @RequestBody UpdateServiceRequest request
    ) {
        return ResponseEntity.ok(
                softwareServiceService.updateService(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long id
    ) {
        softwareServiceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }
}