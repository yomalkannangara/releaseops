package com.releaseops.repository;

import com.releaseops.model.AppUser;
import com.releaseops.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AppUserRepository
        extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    @Query("""
            SELECT user
            FROM AppUser user
            WHERE (:role IS NULL
                    OR user.role = :role)
              AND (:enabled IS NULL
                    OR user.enabled = :enabled)
            """)
    Page<AppUser> findAllFiltered(
            @Param("role") Role role,
            @Param("enabled") Boolean enabled,
            Pageable pageable
    );
}