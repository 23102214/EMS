package com.ems.model;

public class Attendance {
    public String id;
    public String employeeId;
    public String employeeName;
    public String date;
    public String checkIn;
    public String checkOut;
    public AttendanceStatus status;
    public Double workHours;

    public Attendance() {
    }

    public Attendance(String id, String employeeId, String employeeName, String date, String checkIn,
                      String checkOut, AttendanceStatus status, Double workHours) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.date = date;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
        this.workHours = workHours;
    }
}
