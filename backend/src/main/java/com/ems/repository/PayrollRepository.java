package com.ems.repository;

import com.ems.entity.PayrollEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PayrollRepository extends JpaRepository<PayrollEntity, UUID> {
    List<PayrollEntity> findAllByOrderByYearDescMonthAscEmployeeNameAsc();
}
