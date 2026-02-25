package com.hayden.task.tasks;

import com.hayden.task.users.User;
import com.hayden.task.users.UserNotFoundException;
import com.hayden.task.users.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

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
     * @param id        the task ID
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

    public TaskDto createTask(CreateTaskRequest request) {
        User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new UserNotFoundException(request.getAssigneeId()));
        User reporter = userRepository.findById(request.getReporterId())
                .orElseThrow(() -> new UserNotFoundException(request.getReporterId()));

        OffsetDateTime now = OffsetDateTime.now();
        String code = generateTaskCode();

        Task task = Task.builder()
                .code(code)
                .status(TaskStatus.TODO)
                .summary(request.getSummary())
                .details(request.getDetails())
                .assignee(assignee)
                .reporter(reporter)
                .creationDate(now)
                .updatedDate(now)
                .dueDate(request.getDueDate() != null
                        ? request.getDueDate().atTime(LocalTime.MIDNIGHT).atOffset(ZoneOffset.UTC)
                        : null)
                .build();

        Task savedTask = taskRepository.save(task);
        return savedTask.toDto();
    }

    private String generateTaskCode() {
        long nextNumber = taskRepository.countAllTasks() + 1;
        return String.format("TASK-%03d", nextNumber);
    }
}
