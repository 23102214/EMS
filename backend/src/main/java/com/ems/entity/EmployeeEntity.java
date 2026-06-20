package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnTransformer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "employees")
public class EmployeeEntity {
    @Id
    @GeneratedValue
    public UUID id;

    @Column(name = "employee_code")
    public String employeeCode;

    @Column(name = "first_name")
    public String firstName;

    @Column(name = "last_name")
    public String lastName;

    public String email;
    public String phone;

    @Column(name = "department_id")
    public UUID departmentId;

    @Column(name = "department_name")
    public String departmentName;

    public String designation;

    @Column(columnDefinition = "user_role")
    @ColumnTransformer(write = "?::user_role")
    public String role;

    public BigDecimal salary;

    @Column(name = "join_date")
    public LocalDate joinDate;

    @Column(columnDefinition = "employee_status")
    @ColumnTransformer(write = "?::employee_status")
    public String status;

    @Column(columnDefinition = "gender_type")
    @ColumnTransformer(write = "?::gender_type")
    public String gender;

    public LocalDate dob;
    public String address;
}
