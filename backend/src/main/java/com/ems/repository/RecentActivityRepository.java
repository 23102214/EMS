package com.ems.repository;

import com.ems.entity.RecentActivityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RecentActivityRepository extends JpaRepository<RecentActivityEntity, UUID> {
    List<RecentActivityEntity> findTop50ByOrderByCreatedAtDesc();
}
