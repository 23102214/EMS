package com.ems.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class Employee {
    public String id;
    @NotBlank public String firstName;
    @NotBlank public String lastName;
    @Email @NotBlank public String email;
    public String phone;
    @NotBlank public String departmentId;
    public String departmentName;
    public String designation;
    @NotNull public UserRole role;
    public double salary;
    public String joinDate;
    @NotNull public EmployeeStatus status;
    public Gender gender;
    public String dob;
    public String address;

    public Employee() {
    }

    public Employee(String id, String firstName, String lastName, String email, String phone,
                    String departmentId, String departmentName, String designation, UserRole role,
                    double salary, String joinDate, EmployeeStatus status, Gender gender, String dob,
                    String address) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.designation = designation;
        this.role = role;
        this.salary = salary;
        this.joinDate = joinDate;
        this.status = status;
        this.gender = gender;
        this.dob = dob;
        this.address = address;
    }
}
