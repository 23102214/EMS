package com.ems.controller;

import com.ems.dto.PayrollStatusRequest;
import com.ems.model.Payroll;
import com.ems.service.EmsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {
    private final EmsService service;

    public PayrollController(EmsService service) {
        this.service = service;
    }

    @GetMapping
    List<Payroll> getAll() {
        return service.getPayroll();
    }

    @PostMapping
    Payroll create(@RequestBody Payroll payroll) {
        return service.createPayroll(payroll);
    }

    @PutMapping("/{id}/status")
    Payroll updateStatus(@PathVariable String id, @RequestBody PayrollStatusRequest request) {
        return service.updatePayrollStatus(id, request.status);
    }
}
