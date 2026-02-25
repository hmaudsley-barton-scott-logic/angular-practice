package com.hayden.task.tasks;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task,UUID> {
    public List<Task> findByReporterId(UUID id);
    public List<Task> findByAssigneeId(UUID id);

    @Query("SELECT COUNT(t) FROM Task t")
    long countAllTasks();
}
