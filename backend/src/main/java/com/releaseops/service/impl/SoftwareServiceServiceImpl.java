package com.releaseops.service.impl;

import com.releaseops.dto.service.CreateServiceRequest;
import com.releaseops.dto.service.ServiceResponse;
import com.releaseops.dto.service.UpdateServiceRequest;
import com.releaseops.exception.DuplicateResourceException;
import com.releaseops.exception.ResourceNotFoundException;
import com.releaseops.model.ServiceStatus;
import com.releaseops.model.SoftwareService;
import com.releaseops.repository.SoftwareServiceRepository;
import com.releaseops.service.SoftwareServiceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SoftwareServiceServiceImpl implements SoftwareServiceService {

    private final SoftwareServiceRepository serviceRepository;

    public SoftwareServiceServiceImpl(
            SoftwareServiceRepository serviceRepository
    ) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public ServiceResponse createService(CreateServiceRequest request) {
        if (serviceRepository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException(
                    "A service with slug '" + request.slug() + "' already exists"
            );
        }
        if (serviceRepository.existsByNameIgnoreCase(request.name())) {
             throw new DuplicateResourceException(
                     "A service named '" + request.name() + "' already exists"
            );
}       
        SoftwareService service = new SoftwareService();
        service.setName(request.name());
        service.setSlug(request.slug());
        service.setDescription(request.description());
        service.setRepositoryUrl(request.repositoryUrl());
        service.setProductionUrl(request.productionUrl());

        SoftwareService savedService = serviceRepository.save(service);
        return toResponse(savedService);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        return toResponse(findService(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceResponse> getServices(
            ServiceStatus status,
            Pageable pageable
    ) {
        Page<SoftwareService> services;

        if (status == null) {
            services = serviceRepository.findAll(pageable);
        } else {
            services = serviceRepository.findByStatus(status, pageable);
        }

        return services.map(this::toResponse);
    }

    @Override
    public ServiceResponse updateService(
            Long id,
            UpdateServiceRequest request
    ) {
        SoftwareService service = findService(id);

        if (request.name() != null) {
            service.setName(request.name());
        }

        if (request.slug() != null
                && !request.slug().equals(service.getSlug())) {

            if (serviceRepository.existsBySlug(request.slug())) {
                throw new DuplicateResourceException(
                        "A service with slug '" + request.slug()
                                + "' already exists"
                );
            }

            service.setSlug(request.slug());
        }

        if (request.description() != null) {
            service.setDescription(request.description());
        }

        if (request.repositoryUrl() != null) {
            service.setRepositoryUrl(request.repositoryUrl());
        }

        if (request.productionUrl() != null) {
            service.setProductionUrl(request.productionUrl());
        }

        if (request.status() != null) {
            service.setStatus(request.status());
        }

        SoftwareService updatedService = serviceRepository.saveAndFlush(service);
        return toResponse(updatedService);
    }

    @Override
    public void deleteService(Long id) {
        SoftwareService service = findService(id);
        serviceRepository.delete(service);
    }

    private SoftwareService findService(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service not found with ID: " + id
                ));
    }

    private ServiceResponse toResponse(SoftwareService service) {
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getSlug(),
                service.getDescription(),
                service.getRepositoryUrl(),
                service.getProductionUrl(),
                service.getStatus(),
                service.getCreatedAt(),
                service.getUpdatedAt()
        );
    }
}