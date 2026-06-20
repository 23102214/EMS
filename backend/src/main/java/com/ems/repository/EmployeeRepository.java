package com.ems.repository;

import com.ems.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, UUID> {
    long countByDepartmentId(UUID departmentId);

    List<EmployeeEntity> findAllByOrderByEmployeeCodeAsc();
}
