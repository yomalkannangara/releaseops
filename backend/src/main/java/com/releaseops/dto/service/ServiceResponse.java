package com.releaseops.dto.service;

import com.releaseops.model.ServiceStatus;

import java.time.LocalDateTime;

public record ServiceResponse(
        Long id,
        String name,
        String slug,
        String description,
        String repositoryUrl,
        String productionUrl,
        ServiceStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}