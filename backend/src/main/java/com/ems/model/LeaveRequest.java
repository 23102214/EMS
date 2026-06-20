package com.ems.model;

public class LeaveRequest {
    public String id;
    public String employeeId;
    public String employeeName;
    public String departmentName;
    public LeaveType leaveType;
    public String startDate;
    public String endDate;
    public int durationDays;
    public String reason;
    public LeaveStatus status;
    public String appliedDate;
    public String approvedBy;
    public String remarks;

    public LeaveRequest() {
    }

    public LeaveRequest(String id, String employeeId, String employeeName, String departmentName,
                        LeaveType leaveType, String startDate, String endDate, int durationDays,
                        String reason, LeaveStatus status, String appliedDate, String approvedBy,
                        String remarks) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.departmentName = departmentName;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.durationDays = durationDays;
        this.reason = reason;
        this.status = status;
        this.appliedDate = appliedDate;
        this.approvedBy = approvedBy;
        this.remarks = remarks;
    }
}
