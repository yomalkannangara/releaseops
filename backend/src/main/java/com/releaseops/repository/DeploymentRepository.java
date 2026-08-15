package com.releaseops.repository;

import com.releaseops.model.Deployment;
import com.releaseops.model.DeploymentEnvironment;
import com.releaseops.model.DeploymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeploymentRepository
        extends JpaRepository<Deployment, Long> {

    @Query("""
            SELECT deployment
            FROM Deployment deployment
            WHERE (:serviceId IS NULL
                    OR deployment.service.id = :serviceId)
              AND (:status IS NULL
                    OR deployment.status = :status)
              AND (:environment IS NULL
                    OR deployment.environment = :environment)
            """)
    Page<Deployment> findAllFiltered(
            @Param("serviceId") Long serviceId,
            @Param("status") DeploymentStatus status,
            @Param("environment")
            DeploymentEnvironment environment,
            Pageable pageable
    );
}