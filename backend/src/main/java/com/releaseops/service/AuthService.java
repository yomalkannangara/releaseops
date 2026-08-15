package com.releaseops.service;

import com.releaseops.dto.auth.AuthResponse;
import com.releaseops.dto.auth.LoginRequest;
import com.releaseops.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}