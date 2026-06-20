package com.ems.controller;

import com.ems.model.Employee;
import com.ems.service.EmsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmsService service;

    public EmployeeController(EmsService service) {
        this.service = service;
    }

    @GetMapping
    List<Employee> getAll() {
        return service.getEmployees();
    }

    @GetMapping("/{id}")
    Employee getById(@PathVariable String id) {
        return service.getEmployee(id);
    }

    @PostMapping
    Employee create(@Valid @RequestBody Employee employee) {
        return service.createEmployee(employee);
    }

    @PutMapping("/{id}")
    Employee update(@PathVariable String id, @Valid @RequestBody Employee employee) {
        return service.updateEmployee(id, employee);
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable String id) {
        service.deleteEmployee(id);
    }
}
