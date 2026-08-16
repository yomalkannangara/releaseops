package com.releaseops.service;

import com.releaseops.dto.user.CreateUserRequest;
import com.releaseops.dto.user.UpdateUserRequest;
import com.releaseops.dto.user.UserResponse;
import com.releaseops.model.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponse createUser(CreateUserRequest request);

    UserResponse getUserById(Long id);

    Page<UserResponse> getUsers(
            Role role,
            Boolean enabled,
            Pageable pageable
    );

    UserResponse updateUser(
            Long id,
            UpdateUserRequest request
    );
}