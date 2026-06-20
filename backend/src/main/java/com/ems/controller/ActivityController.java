package com.ems.controller;

import com.ems.model.RecentActivity;
import com.ems.service.EmsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final EmsService service;

    public ActivityController(EmsService service) {
        this.service = service;
    }

    @GetMapping
    List<RecentActivity> getAll() {
        return service.getActivities();
    }
}
