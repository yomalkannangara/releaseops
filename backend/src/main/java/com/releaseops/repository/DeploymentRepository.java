package com.releaseops.repository;

import com.releaseops.model.Deployment;
import com.releaseops.model.DeploymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeploymentRepository
        extends JpaRepository<Deployment, Long> {

    Page<Deployment> findByService_Id(
            Long serviceId,
            Pageable pageable
    );

    Page<Deployment> findByStatus(
            DeploymentStatus status,
            Pageable pageable
    );
}