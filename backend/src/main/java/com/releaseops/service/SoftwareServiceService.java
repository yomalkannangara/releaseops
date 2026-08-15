package com.releaseops.service;

import com.releaseops.dto.service.CreateServiceRequest;
import com.releaseops.dto.service.ServiceResponse;
import com.releaseops.dto.service.UpdateServiceRequest;
import com.releaseops.model.ServiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SoftwareServiceService {

    ServiceResponse createService(CreateServiceRequest request);

    ServiceResponse getServiceById(Long id);

    Page<ServiceResponse> getServices(
            ServiceStatus status,
            Pageable pageable
    );

    ServiceResponse updateService(
            Long id,
            UpdateServiceRequest request
    );

    void deleteService(Long id);
}