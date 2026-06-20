package com.ems.controller;

import com.ems.dto.LeaveProcessRequest;
import com.ems.model.LeaveRequest;
import com.ems.service.EmsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {
    private final EmsService service;

    public LeaveController(EmsService service) {
        this.service = service;
    }

    @GetMapping
    List<LeaveRequest> getAll() {
        return service.getLeaves();
    }

    @PostMapping
    LeaveRequest apply(@RequestBody LeaveRequest leaveRequest) {
        return service.applyLeave(leaveRequest);
    }

    @PostMapping("/{id}/process")
    LeaveRequest process(@PathVariable String id, @RequestBody LeaveProcessRequest request) {
        return service.processLeave(id, request);
    }
}
