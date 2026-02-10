package com.hayden.task.tasks;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

    List<TaskDto> getTasksByAssignee(UUID reporterId) {
        return taskRepository.findByAssigneeId(reporterId)
                .stream()
                .map(Task::toDto)
                .toList();
    }


}
