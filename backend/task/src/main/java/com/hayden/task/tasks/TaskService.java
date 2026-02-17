package com.hayden.task.tasks;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(Task::toDto)
                .toList();
    }

    public TaskDto getTask(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        return task.toDto();
    }

    List<TaskDto> getTasksByReporter(UUID reporterId) {
        return taskRepository.findByReporterId(reporterId)
                .stream()
                .map(Task::toDto)
                .toList();
    }

    List<TaskDto> getTasksByAssignee(UUID assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId)
                .stream()
                .map(Task::toDto)
                .toList();
    }

    /**
     * Updates the status of a task.
     * Single responsibility: handles only status update logic.
     * 
     * @param id the task ID
     * @param newStatus the new status value
     * @return the updated task DTO
     * @throws TaskNotFoundException if task doesn't exist
     */
    public TaskDto updateStatus(UUID id, String newStatus) {
        if (!TaskStatus.isValid(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        
        task.setStatus(TaskStatus.valueOf(newStatus));
        task.setUpdatedDate(OffsetDateTime.now());
        
        Task savedTask = taskRepository.save(task);
        return savedTask.toDto();
    }


}
