package com.ems.model;

public class RecentActivity {
    public String id;
    public ActivityType type;
    public String title;
    public String description;
    public String timestamp;
    public String user;

    public RecentActivity() {
    }

    public RecentActivity(String id, ActivityType type, String title, String description,
                          String timestamp, String user) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.description = description;
        this.timestamp = timestamp;
        this.user = user;
    }
}
