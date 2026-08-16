package com.releaseops.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;
@Test
void anonymousUserCannotRegister() throws Exception {
    mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                            {
                              "fullName": "Unauthorized User",
                              "email": "unauthorized@releaseops.local",
                              "password": "Unauthorized@123"
                            }
                            """))
            .andExpect(status().isUnauthorized());
}

@Test
@WithMockUser(
        username = "engineer@releaseops.local",
        roles = "ENGINEER"
)
void engineerCannotAccessAdminUserApi() throws Exception {
    mockMvc.perform(get("/api/admin/users"))
            .andExpect(status().isForbidden());
}
    @Test
    void unauthenticatedRequestReturns401() throws Exception {
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(
            username = "engineer@releaseops.local",
            roles = "ENGINEER"
    )
    void engineerCannotDeleteService() throws Exception {
        mockMvc.perform(delete("/api/services/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(
            username = "viewer@releaseops.local",
            roles = "VIEWER"
    )
    void viewerCanReadServices() throws Exception {
        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk());
    }
}