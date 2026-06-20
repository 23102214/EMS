package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnTransformer;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "attendance")
public class AttendanceEntity {
    @Id
    @GeneratedValue
    public UUID id;

    @Column(name = "employee_id")
    public UUID employeeId;

    @Column(name = "employee_name")
    public String employeeName;

    @Column(name = "attendance_date")
    public LocalDate date;

    @Column(name = "check_in")
    public LocalTime checkIn;

    @Column(name = "check_out")
    public LocalTime checkOut;

    @Column(columnDefinition = "attendance_status")
    @ColumnTransformer(write = "?::attendance_status")
    public String status;

    @Column(name = "work_hours")
    public BigDecimal workHours;
}
