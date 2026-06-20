package com.ems.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.ColumnTransformer;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "recent_activities")
public class RecentActivityEntity {
    @Id
    @GeneratedValue
    public UUID id;

    @Column(columnDefinition = "activity_type")
    @ColumnTransformer(write = "?::activity_type")
    public String type;

    public String title;
    public String description;

    @Column(name = "timestamp_label")
    public String timestampLabel;

    @Column(name = "actor")
    public String user;

    @Column(name = "created_at", insertable = false, updatable = false)
    public OffsetDateTime createdAt;
}
