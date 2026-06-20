package com.ems.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum EmployeeStatus {
    Active,
    Inactive,
    @JsonProperty("On Leave")
    OnLeave,
    Suspended
}
