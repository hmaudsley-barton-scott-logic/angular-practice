package com.hayden.task.tasks;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllTasks_returnsTaskDtos() {
        Task task = new Task();
        List<Task> tasks = List.of(task);
        when(taskRepository.findAll()).thenReturn(tasks);
        List<TaskDto> result = taskService.getAllTasks();
        assertThat(result).hasSize(1);
    }

    @Test
    void getTasksByReporter_returnsTaskDtos() {
        UUID reporterId = UUID.randomUUID();
        Task task = new Task();
        List<Task> tasks = List.of(task);
        when(taskRepository.findByReporterId(reporterId)).thenReturn(tasks);
        List<TaskDto> result = taskService.getTasksByReporter(reporterId);
        assertThat(result).hasSize(1);
    }

    @Test
    void getTasksByAssignee_returnsTaskDtos() {
        UUID assigneeId = UUID.randomUUID();
        Task task = new Task();
        List<Task> tasks = List.of(task);
        when(taskRepository.findByAssigneeId(assigneeId)).thenReturn(tasks);
        List<TaskDto> result = taskService.getTasksByAssignee(assigneeId);
        assertThat(result).hasSize(1);
    }

    @Test
    void getAllTasks_returnsEmptyList() {
        when(taskRepository.findAll()).thenReturn(Collections.emptyList());
        List<TaskDto> result = taskService.getAllTasks();
        assertThat(result).isEmpty();
    }
}
