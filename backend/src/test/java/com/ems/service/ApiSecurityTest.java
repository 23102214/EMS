package com.ems.service;

import com.ems.config.SecurityConfig;
import com.ems.controller.AuthController;
import com.ems.controller.EmployeeController;
import com.ems.controller.HealthController;
import com.ems.dto.AuthResponse;
import com.ems.dto.UserResponse;
import com.ems.entity.AppUserEntity;
import com.ems.model.Employee;
import com.ems.model.EmployeeStatus;
import com.ems.model.Gender;
import com.ems.model.UserRole;
import com.ems.security.JwtAuthenticationFilter;
import com.ems.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        AuthController.class,
        EmployeeController.class,
        HealthController.class
})
@Import({
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        JwtService.class,
        ApiSecurityTest.FakeServices.class
})
@TestPropertySource(properties = {
        "app.jwt.secret=test-secret-key-for-jwt-tests-that-is-long-enough",
        "app.jwt.expiration-ms=86400000"
})
class ApiSecurityTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Test
    void healthIsPublic() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void employeesRejectsAnonymousRequests() throws Exception {
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isForbidden());
    }

    @Test
    void loginReturnsTokenAndUser() throws Exception {
        UserResponse user = new UserResponse(
                UUID.randomUUID().toString(),
                "Sarah",
                "Jenkins",
                "sarah.j@enterprise.com",
                UserRole.ADMIN,
                "Engineering",
                "VP of Engineering",
                null
        );
        FakeServices.loginResponse = new AuthResponse("jwt-token", user);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "admin@enterprise.com",
                                  "password": "admin123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"))
                .andExpect(jsonPath("$.user.email").value("sarah.j@enterprise.com"));
    }

    @Test
    void employeesAllowsBearerTokenRequests() throws Exception {
        Employee employee = new Employee(
                UUID.randomUUID().toString(),
                "Sarah",
                "Jenkins",
                "sarah.j@enterprise.com",
                "+1 (555) 019-2834",
                UUID.randomUUID().toString(),
                "Engineering",
                "VP of Engineering",
                UserRole.ADMIN,
                135000,
                "2022-01-15",
                EmployeeStatus.Active,
                Gender.Female,
                "1987-03-22",
                "422 Pine Ave, Seattle, WA"
        );
        FakeServices.employees = List.of(employee);

        mockMvc.perform(get("/api/employees")
                        .header("Authorization", "Bearer " + tokenFor(UserRole.ADMIN)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].email").value("sarah.j@enterprise.com"));
    }

    private String tokenFor(UserRole role) {
        AppUserEntity user = new AppUserEntity();
        user.id = UUID.randomUUID();
        user.email = "admin@enterprise.com";
        user.role = role.name();
        user.employeeId = UUID.randomUUID();
        user.active = true;
        return jwtService.createToken(user);
    }

    @TestConfiguration
    static class FakeServices {
        static AuthResponse loginResponse;
        static List<Employee> employees = List.of();

        @Bean
        AuthService authService() {
            return new AuthService(null, null, null, null) {
                @Override
                public AuthResponse login(String email, String password) {
                    return loginResponse;
                }
            };
        }

        @Bean
        EmsService emsService() {
            return new EmsService(null, null, null, null, null, null) {
                @Override
                void seedIfEmpty() {
                    // Test double: avoid database seeding.
                }

                @Override
                public List<Employee> getEmployees() {
                    return employees;
                }
            };
        }
    }
}
