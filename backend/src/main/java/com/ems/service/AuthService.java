package com.ems.service;

import com.ems.dto.AuthResponse;
import com.ems.dto.UserResponse;
import com.ems.entity.AppUserEntity;
import com.ems.entity.EmployeeEntity;
import com.ems.model.UserRole;
import com.ems.repository.AppUserRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AppUserRepository users;
    private final EmployeeRepository employees;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(AppUserRepository users, EmployeeRepository employees,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.employees = employees;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(String email, String password) {
        AppUserEntity user = users.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> invalidCredentials());
        if (!user.active || !passwordEncoder.matches(password, user.passwordHash)) {
            throw invalidCredentials();
        }

        EmployeeEntity employee = user.employeeId == null ? null : employees.findById(user.employeeId).orElse(null);
        String token = jwtService.createToken(user);
        return new AuthResponse(token, toUserResponse(user, employee));
    }

    private UserResponse toUserResponse(AppUserEntity user, EmployeeEntity employee) {
        if (employee == null) {
            return new UserResponse(user.id.toString(), "System", "Admin", user.email, UserRole.valueOf(user.role),
                    null, "Administrator", null);
        }
        String avatar = "https://images.unsplash.com/photo-" +
                ("Female".equals(employee.gender) ? "1494790108377-be9c29b29330" : "1500648767791-00dcc994a43e") +
                "?auto=format&fit=crop&w=120&q=80";
        return new UserResponse(employee.id.toString(), employee.firstName, employee.lastName, employee.email,
                UserRole.valueOf(user.role), employee.departmentName, employee.designation, avatar);
    }

    private ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }
}
