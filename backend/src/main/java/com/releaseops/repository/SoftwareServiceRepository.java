package com.releaseops.repository;

import com.releaseops.model.ServiceStatus;
import com.releaseops.model.SoftwareService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SoftwareServiceRepository
        extends JpaRepository<SoftwareService, Long> {

    Optional<SoftwareService> findBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);

    Page<SoftwareService> findByStatus(
            ServiceStatus status,
            Pageable pageable
    );
}