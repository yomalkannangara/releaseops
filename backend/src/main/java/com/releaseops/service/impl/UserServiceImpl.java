package com.releaseops.service.impl;

import com.releaseops.dto.user.CreateUserRequest;
import com.releaseops.dto.user.UpdateUserRequest;
import com.releaseops.dto.user.UserResponse;
import com.releaseops.exception.BadRequestException;
import com.releaseops.exception.DuplicateResourceException;
import com.releaseops.exception.ResourceNotFoundException;
import com.releaseops.model.AppUser;
import com.releaseops.model.Role;
import com.releaseops.repository.AppUserRepository;
import com.releaseops.service.AuditLogService;
import com.releaseops.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Map;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public UserServiceImpl(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            AuditLogService auditLogService
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        String email = normalizeEmail(request.email());

        if (appUserRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException(
                    "A user with this email already exists"
            );
        }

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPasswordHash(
                passwordEncoder.encode(request.password())
        );
        user.setRole(request.role());
        user.setEnabled(true);

        AppUser savedUser = appUserRepository.save(user);

        auditLogService.record(
                "CREATED",
                "USER",
                savedUser.getId(),
                Map.of(
                        "email", savedUser.getEmail(),
                        "role", savedUser.getRole().name(),
                        "enabled", savedUser.isEnabled()
                )
        );

        return toResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return toResponse(findUser(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(
            Role role,
            Boolean enabled,
            Pageable pageable
    ) {
        return appUserRepository
                .findAllFiltered(role, enabled, pageable)
                .map(this::toResponse);
    }

    @Override
    public UserResponse updateUser(
            Long id,
            UpdateUserRequest request
    ) {
        AppUser user = findUser(id);
        validateSelfUpdate(user, request);

        String previousFullName = user.getFullName();
        Role previousRole = user.getRole();
        boolean previousEnabled = user.isEnabled();

        if (request.fullName() != null) {
            user.setFullName(request.fullName().trim());
        }

        if (request.role() != null) {
            user.setRole(request.role());
        }

        if (request.enabled() != null) {
            user.setEnabled(request.enabled());
        }

        AppUser updatedUser =
                appUserRepository.saveAndFlush(user);

        auditLogService.record(
                "UPDATED",
                "USER",
                updatedUser.getId(),
                Map.of(
                        "previousFullName", previousFullName,
                        "newFullName", updatedUser.getFullName(),
                        "previousRole", previousRole.name(),
                        "newRole", updatedUser.getRole().name(),
                        "previousEnabled", previousEnabled,
                        "newEnabled", updatedUser.isEnabled()
                )
        );

        return toResponse(updatedUser);
    }

    private void validateSelfUpdate(
            AppUser user,
            UpdateUserRequest request
    ) {
        String currentEmail =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName();

        boolean updatingOwnAccount =
                user.getEmail().equalsIgnoreCase(currentEmail);

        if (!updatingOwnAccount) {
            return;
        }

        if (Boolean.FALSE.equals(request.enabled())) {
            throw new BadRequestException(
                    "You cannot disable your own account"
            );
        }

        if (request.role() != null
                && request.role() != Role.ADMIN) {
            throw new BadRequestException(
                    "You cannot remove your own ADMIN role"
            );
        }
    }

    private AppUser findUser(Long id) {
        return appUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with ID: " + id
                ));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private UserResponse toResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}