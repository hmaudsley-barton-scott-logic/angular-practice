package com.hayden.task.tasks;

import com.hayden.task.users.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private com.hayden.task.users.UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

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
    void getTask_returnsTaskDto() {
        Task task = Task.builder().id(task1).assignee(bob).reporter(alice).build();
        when(taskRepository.findById(task1)).thenReturn(java.util.Optional.of(task));
        TaskDto result = taskService.getTask(task1);
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(task1);
    }

    @Test
    void getTask_throwsExceptionWhenNotFound() {
        when(taskRepository.findById(task1)).thenReturn(java.util.Optional.empty());
        org.junit.jupiter.api.Assertions.assertThrows(TaskNotFoundException.class, () -> taskService.getTask(task1));
    }

    @Test
    void getAllTasks_returnsEmptyList() {
        when(taskRepository.findAll()).thenReturn(Collections.emptyList());
        List<TaskDto> result = taskService.getAllTasks();
        assertThat(result).isEmpty();
    }

    @Test
    void updateStatus_updatesTaskStatusSuccessfully() {
        Task task = Task.builder()
            .id(task1)
            .status(TaskStatus.TODO)
            .assignee(bob)
            .reporter(alice)
            .build();
        Task savedTask = Task.builder()
            .id(task1)
            .status(TaskStatus.IN_PROGRESS)
            .assignee(bob)
            .reporter(alice)
            .build();
        
        when(taskRepository.findById(task1)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);
        
        TaskDto result = taskService.updateStatus(task1, "IN_PROGRESS");
        
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo("IN_PROGRESS");
        verify(taskRepository).save(any(Task.class));
        }

    @Test
    void updateStatus_throwsExceptionWhenTaskNotFound() {
        when(taskRepository.findById(task1)).thenReturn(Optional.empty());
        
        org.junit.jupiter.api.Assertions.assertThrows(
            TaskNotFoundException.class,
            () -> taskService.updateStatus(task1, "IN_PROGRESS")
        );
        }

    @Test
    void updateStatus_throwsExceptionWhenStatusInvalid() {
        org.junit.jupiter.api.Assertions.assertThrows(
            IllegalArgumentException.class,
            () -> taskService.updateStatus(task1, "NOT_A_STATUS")
        );
        }

    @Test
    void updateStatus_setsUpdatedDate() {
        OffsetDateTime beforeUpdate = OffsetDateTime.now().minusSeconds(1);
        Task task = Task.builder()
                .id(task1)
                .status(TaskStatus.TODO)
                .assignee(bob)
                .reporter(alice)
                .build();
        
        when(taskRepository.findById(task1)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
        taskService.updateStatus(task1, "DONE");
        
        assertThat(task.getUpdatedDate()).isNotNull();
        assertThat(task.getUpdatedDate()).isAfter(beforeUpdate);
    }

    @Test
    void createTask_createsAndReturnsTaskDto() {
        CreateTaskRequest request = CreateTaskRequest.builder()
                .summary("Test task")
                .details("Test details")
                .assigneeId(bobId)
                .reporterId(aliceId)
                .build();
        
        when(userRepository.findById(bobId)).thenReturn(Optional.of(bob));
        when(userRepository.findById(aliceId)).thenReturn(Optional.of(alice));
        when(taskRepository.countAllTasks()).thenReturn(0L);
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
            Task task = invocation.getArgument(0);
            task.setId(task1);
            return task;
        });
        
        TaskDto result = taskService.createTask(request);
        
        assertThat(result).isNotNull();
        assertThat(result.getSummary()).isEqualTo("Test task");
        assertThat(result.getStatus()).isEqualTo("TODO");
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void createTask_throwsExceptionWhenAssigneeNotFound() {
        CreateTaskRequest request = CreateTaskRequest.builder()
                .summary("Test task")
                .assigneeId(bobId)
                .reporterId(aliceId)
                .build();
        
        when(userRepository.findById(bobId)).thenReturn(Optional.empty());
        
        org.junit.jupiter.api.Assertions.assertThrows(
            com.hayden.task.users.UserNotFoundException.class,
            () -> taskService.createTask(request)
        );
    }

    @Test
    void createTask_throwsExceptionWhenReporterNotFound() {
        CreateTaskRequest request = CreateTaskRequest.builder()
                .summary("Test task")
                .assigneeId(bobId)
                .reporterId(aliceId)
                .build();
        
        when(userRepository.findById(bobId)).thenReturn(Optional.of(bob));
        when(userRepository.findById(aliceId)).thenReturn(Optional.empty());
        
        org.junit.jupiter.api.Assertions.assertThrows(
            com.hayden.task.users.UserNotFoundException.class,
            () -> taskService.createTask(request)
        );
    }
}
