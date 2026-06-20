package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnTransformer;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "leave_requests")
public class LeaveRequestEntity {
    @Id
    @GeneratedValue
    public UUID id;

    @Column(name = "employee_id")
    public UUID employeeId;

    @Column(name = "employee_name")
    public String employeeName;

    @Column(name = "department_name")
    public String departmentName;

    @Column(name = "leave_type", columnDefinition = "leave_type")
    @ColumnTransformer(write = "?::leave_type")
    public String leaveType;

    @Column(name = "start_date")
    public LocalDate startDate;

    @Column(name = "end_date")
    public LocalDate endDate;

    @Column(name = "duration_days")
    public int durationDays;

    public String reason;

    @Column(columnDefinition = "leave_status")
    @ColumnTransformer(write = "?::leave_status")
    public String status;

    @Column(name = "applied_date")
    public LocalDate appliedDate;

    @Column(name = "approved_by")
    public UUID approvedBy;

    public String remarks;
}
