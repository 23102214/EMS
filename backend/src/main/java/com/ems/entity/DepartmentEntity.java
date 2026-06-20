package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "departments")
public class DepartmentEntity {
    @Id
    @GeneratedValue
    public UUID id;

    public String name;
    public String code;
    public String description;

    @Column(name = "manager_id")
    public UUID managerId;

    @Column(name = "manager_name")
    public String managerName;

    @Column(name = "employee_count")
    public int employeeCount;
}
