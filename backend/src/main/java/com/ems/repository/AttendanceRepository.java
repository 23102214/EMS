package com.ems.repository;

import com.ems.entity.AttendanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<AttendanceEntity, UUID> {
    List<AttendanceEntity> findAllByOrderByDateDescEmployeeNameAsc();

    Optional<AttendanceEntity> findByEmployeeIdAndDate(UUID employeeId, LocalDate date);
}
