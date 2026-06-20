package com.ems.controller;

import com.ems.model.Attendance;
import com.ems.service.EmsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
    private final EmsService service;

    public AttendanceController(EmsService service) {
        this.service = service;
    }

    @GetMapping
    List<Attendance> getAll() {
        return service.getAttendance();
    }

    @PostMapping("/clock-in/{employeeId}")
    Attendance clockIn(@PathVariable String employeeId) {
        return service.clockIn(employeeId);
    }

    @PostMapping("/clock-out/{employeeId}")
    Attendance clockOut(@PathVariable String employeeId) {
        return service.clockOut(employeeId);
    }
}
