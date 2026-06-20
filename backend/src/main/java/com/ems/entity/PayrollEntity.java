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
@Table(name = "payroll")
public class PayrollEntity {
    @Id
    @GeneratedValue
    public UUID id;

    @Column(name = "employee_id")
    public UUID employeeId;

    @Column(name = "employee_name")
    public String employeeName;

    @Column(name = "department_name")
    public String departmentName;

    public String designation;
    public String month;
    public int year;

    @Column(name = "base_salary")
    public BigDecimal baseSalary;

    public BigDecimal allowances;
    public BigDecimal deductions;

    @Column(name = "net_salary")
    public BigDecimal netSalary;

    @Column(columnDefinition = "payroll_status")
    @ColumnTransformer(write = "?::payroll_status")
    public String status;

    @Column(name = "payment_date")
    public LocalDate paymentDate;
}
