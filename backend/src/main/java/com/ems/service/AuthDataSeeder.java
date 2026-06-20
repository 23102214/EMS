package com.ems.service;

import com.ems.entity.AppUserEntity;
import com.ems.entity.EmployeeEntity;
import com.ems.repository.AppUserRepository;
import com.ems.repository.EmployeeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@DependsOn("emsService")
public class AuthDataSeeder {
    private final AppUserRepository users;
    private final EmployeeRepository employees;
    private final PasswordEncoder passwordEncoder;

    public AuthDataSeeder(AppUserRepository users, EmployeeRepository employees, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.employees = employees;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    @Transactional
    void seedUsers() {
        for (EmployeeEntity employee : employees.findAll()) {
            createUserIfMissing(employee.email, "admin123", employee.role, employee.id);
        }
        employees.findAllByOrderByEmployeeCodeAsc().stream()
                .filter(employee -> "ADMIN".equals(employee.role))
                .findFirst()
                .ifPresent(admin -> createUserIfMissing("admin@enterprise.com", "admin123", "ADMIN", admin.id));
    }

    private void createUserIfMissing(String email, String rawPassword, String role, java.util.UUID employeeId) {
        if (users.existsByEmailIgnoreCase(email)) {
            return;
        }
        AppUserEntity user = new AppUserEntity();
        user.email = email.toLowerCase();
        user.passwordHash = passwordEncoder.encode(rawPassword);
        user.role = role;
        user.employeeId = employeeId;
        user.active = true;
        users.save(user);
    }
}
