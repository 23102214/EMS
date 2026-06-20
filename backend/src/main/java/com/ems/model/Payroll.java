package com.ems.model;

public class Payroll {
    public String id;
    public String employeeId;
    public String employeeName;
    public String departmentName;
    public String designation;
    public String month;
    public int year;
    public double baseSalary;
    public double allowances;
    public double deductions;
    public double netSalary;
    public PayrollStatus status;
    public String paymentDate;

    public Payroll() {
    }

    public Payroll(String id, String employeeId, String employeeName, String departmentName,
                   String designation, String month, int year, double baseSalary, double allowances,
                   double deductions, double netSalary, PayrollStatus status, String paymentDate) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.departmentName = departmentName;
        this.designation = designation;
        this.month = month;
        this.year = year;
        this.baseSalary = baseSalary;
        this.allowances = allowances;
        this.deductions = deductions;
        this.netSalary = netSalary;
        this.status = status;
        this.paymentDate = paymentDate;
    }
}
