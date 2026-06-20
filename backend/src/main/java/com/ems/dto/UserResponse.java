package com.ems.dto;

import com.ems.model.UserRole;

public class UserResponse {
    public String id;
    public String firstName;
    public String lastName;
    public String email;
    public UserRole role;
    public String department;
    public String designation;
    public String avatar;

    public UserResponse(String id, String firstName, String lastName, String email, UserRole role,
                        String department, String designation, String avatar) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.avatar = avatar;
    }
}
