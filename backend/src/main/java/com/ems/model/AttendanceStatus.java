package com.ems.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum AttendanceStatus {
    Present,
    Absent,
    Late,
    @JsonProperty("Half-Day")
    HalfDay
}
