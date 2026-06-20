package com.ems.controller;

import com.ems.model.Department;
import com.ems.service.EmsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final EmsService service;

    public DepartmentController(EmsService service) {
        this.service = service;
    }

    @GetMapping
    List<Department> getAll() {
        return service.getDepartments();
    }

    @PostMapping
    Department create(@Valid @RequestBody Department department) {
        return service.createDepartment(department);
    }

    @PutMapping("/{id}")
    Department update(@PathVariable String id, @Valid @RequestBody Department department) {
        return service.updateDepartment(id, department);
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable String id) {
        service.deleteDepartment(id);
    }
}
