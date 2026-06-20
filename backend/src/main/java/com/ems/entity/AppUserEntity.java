package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnTransformer;

import java.util.UUID;

@Entity
@Table(name = "app_users")
public class AppUserEntity {
    @Id
    @GeneratedValue
    public UUID id;

    @Column(nullable = false, unique = true)
    public String email;

    @Column(name = "password_hash", nullable = false)
    public String passwordHash;

    @Column(columnDefinition = "user_role")
    @ColumnTransformer(write = "?::user_role")
    public String role;

    @Column(name = "employee_id")
    public UUID employeeId;

    @Column(nullable = false)
    public boolean active = true;
}
