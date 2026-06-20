package com.ems.model;

import jakarta.validation.constraints.NotBlank;

public class Department {
    public String id;
    @NotBlank public String name;
    @NotBlank public String code;
    public String description;
    public String managerId;
    public String managerName;
    public int employeeCount;

    public Department() {
    }

    public Department(String id, String name, String code, String description, String managerId,
                      String managerName, int employeeCount) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.managerId = managerId;
        this.managerName = managerName;
        this.employeeCount = employeeCount;
    }
}
