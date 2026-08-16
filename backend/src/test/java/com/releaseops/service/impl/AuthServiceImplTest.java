package com.releaseops.service.impl;

import com.releaseops.dto.auth.RegisterRequest;
import com.releaseops.exception.DuplicateResourceException;
import com.releaseops.repository.AppUserRepository;
import com.releaseops.security.CustomUserDetailsService;
import com.releaseops.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import com.releaseops.dto.auth.AuthResponse;
import com.releaseops.model.AppUser;
import com.releaseops.model.Role;
import org.mockito.ArgumentCaptor;
import org.springframework.security.core.userdetails.UserDetails;
import com.releaseops.dto.auth.LoginRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {
@Mock
private UserDetails userDetails;
    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;
    @Test
void loginAuthenticatesNormalizedEmailAndReturnsToken() {
    LoginRequest request = new LoginRequest(
            " ADMIN@releaseops.local ",
            "Admin@123"
    );

    AppUser user = new AppUser();
    user.setEmail("admin@releaseops.local");
    user.setFullName("ReleaseOps Admin");
    user.setRole(Role.ADMIN);
    user.setEnabled(true);

    when(appUserRepository.findByEmailIgnoreCase(
            "admin@releaseops.local"
    )).thenReturn(Optional.of(user));

    when(userDetailsService.loadUserByUsername(
            "admin@releaseops.local"
    )).thenReturn(userDetails);

    when(jwtService.generateToken(userDetails))
            .thenReturn("admin-jwt-token");

    when(jwtService.getExpirationSeconds())
            .thenReturn(3600L);

    AuthResponse response = authService.login(request);

    ArgumentCaptor<UsernamePasswordAuthenticationToken>
            authenticationCaptor =
            ArgumentCaptor.forClass(
                    UsernamePasswordAuthenticationToken.class
            );

    verify(authenticationManager)
            .authenticate(authenticationCaptor.capture());

    assertEquals(
            "admin@releaseops.local",
            authenticationCaptor.getValue().getPrincipal()
    );
    assertEquals(
            "Admin@123",
            authenticationCaptor.getValue().getCredentials()
    );

    assertEquals("admin-jwt-token", response.token());
    assertEquals("admin@releaseops.local", response.email());
    assertEquals("ReleaseOps Admin", response.fullName());
    assertEquals(Role.ADMIN, response.role());
}
@Test
void registerCreatesEngineerWithHashedPasswordAndToken() {
    RegisterRequest request = new RegisterRequest(
            "  New Engineer  ",
            " NEW@releaseops.local ",
            "Engineer@123"
    );

    when(passwordEncoder.encode("Engineer@123"))
            .thenReturn("hashed-password");

    when(appUserRepository.save(any(AppUser.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

    when(userDetailsService.loadUserByUsername(
            "new@releaseops.local"
    )).thenReturn(userDetails);

    when(jwtService.generateToken(userDetails))
            .thenReturn("jwt-token");

    when(jwtService.getExpirationSeconds())
            .thenReturn(3600L);

    AuthResponse response = authService.register(request);

    ArgumentCaptor<AppUser> userCaptor =
            ArgumentCaptor.forClass(AppUser.class);

    verify(appUserRepository).save(userCaptor.capture());

    AppUser savedUser = userCaptor.getValue();

    assertEquals("New Engineer", savedUser.getFullName());
    assertEquals(
            "new@releaseops.local",
            savedUser.getEmail()
    );
    assertEquals(
            "hashed-password",
            savedUser.getPasswordHash()
    );
    assertEquals(Role.ENGINEER, savedUser.getRole());
    assertTrue(savedUser.isEnabled());

    assertEquals("jwt-token", response.token());
    assertEquals("Bearer", response.tokenType());
    assertEquals(3600L, response.expiresIn());
    assertEquals(Role.ENGINEER, response.role());
}
    @Test
    void registerThrowsConflictWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "Yomal Kannangara",
                " YOMAL@releaseops.local ",
                "ReleaseOps@123"
        );

        when(appUserRepository.existsByEmailIgnoreCase(
                "yomal@releaseops.local"
        )).thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> authService.register(request)
        );

        verify(appUserRepository, never()).save(any());
        verifyNoInteractions(
                passwordEncoder,
                authenticationManager,
                userDetailsService,
                jwtService
        );
    }
}