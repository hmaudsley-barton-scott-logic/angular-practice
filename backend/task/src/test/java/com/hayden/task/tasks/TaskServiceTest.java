package com.hayden.task.tasks;

import com.hayden.task.users.User;
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

    UUID task1 = UUID.randomUUID();
    UUID aliceId = UUID.randomUUID();
    User alice = User.builder().id(aliceId).userName("alice").build();
    UUID bobId = UUID.randomUUID();
    User bob = User.builder().id(bobId).userName("bob").build();

    @Test
    void getAllTasks_returnsTaskDtos() {
        Task task = Task.builder().id(task1).assignee(bob).reporter(alice).build();
        List<Task> tasks = List.of(task);
        when(taskRepository.findAll()).thenReturn(tasks);
        List<TaskDto> result = taskService.getAllTasks();
        assertThat(result).hasSize(1);
    }

    @Test
    void getTasksByReporter_returnsTaskDtos() {
        Task task = Task.builder().id(task1).assignee(bob).reporter(alice).build();
        List<Task> tasks = List.of(task);
        when(taskRepository.findByReporterId(aliceId)).thenReturn(tasks);
        List<TaskDto> result = taskService.getTasksByReporter(aliceId);
        assertThat(result).hasSize(1);
    }

    @Test
    void getTasksByAssignee_returnsTaskDtos() {
        Task task = Task.builder().id(task1).assignee(bob).reporter(alice).build();
        List<Task> tasks = List.of(task);
        when(taskRepository.findByAssigneeId(bobId)).thenReturn(tasks);
        List<TaskDto> result = taskService.getTasksByAssignee(bobId);
        assertThat(result).hasSize(1);
    }

    @Test
    void getAllTasks_returnsEmptyList() {
        when(taskRepository.findAll()).thenReturn(Collections.emptyList());
        List<TaskDto> result = taskService.getAllTasks();
        assertThat(result).isEmpty();
    }
}
