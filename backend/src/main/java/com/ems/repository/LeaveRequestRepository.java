package com.ems.repository;

import com.ems.entity.LeaveRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequestEntity, UUID> {
    List<LeaveRequestEntity> findAllByOrderByAppliedDateDesc();
}
