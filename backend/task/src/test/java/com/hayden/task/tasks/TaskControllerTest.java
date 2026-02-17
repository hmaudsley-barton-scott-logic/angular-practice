package com.hayden.task.tasks;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TaskService taskService;
    
    @BeforeEach
    void setUp() {
        TaskController taskController = new TaskController(taskService);
        mockMvc = MockMvcBuilders.standaloneSetup(taskController).build();
    }

    UUID task1 = UUID.randomUUID();
    UUID aliceId = UUID.randomUUID();
    UUID bobId = UUID.randomUUID();

    @Test
    void getTasks_returnsTaskDtos() throws Exception {
        TaskDto taskDto = TaskDto.builder()
                .id(task1)
                .code("TASK-001")
                .status("TODO")
                .reporterId(aliceId)
                .assigneeId(bobId)
                .reporterName("alice")
                .assigneeName("bob")
                .summary("Test Task")
                .details("Details")
                .build();
        List<TaskDto> taskDtos = List.of(taskDto);
        when(taskService.getAllTasks()).thenReturn(taskDtos);

        mockMvc.perform(get("/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(task1.toString()))
                .andExpect(jsonPath("$[0].code").value("TASK-001"));
    }

    @Test
    void getTask_returnsTaskDto() throws Exception {
        TaskDto taskDto = TaskDto.builder()
                .id(task1)
                .code("TASK-001")
                .status("TODO")
                .reporterId(aliceId)
                .assigneeId(bobId)
                .reporterName("alice")
                .assigneeName("bob")
                .summary("Test Task")
                .details("Details")
                .build();
        when(taskService.getTask(task1)).thenReturn(taskDto);

        mockMvc.perform(get("/tasks/{id}", task1))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(task1.toString()));
    }

    @Test
    void getTask_returnsNotFoundWhenTaskNotFound() throws Exception {
        when(taskService.getTask(task1)).thenThrow(new TaskNotFoundException(task1));

        mockMvc.perform(get("/tasks/{id}", task1))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateTaskStatus_returnsUpdatedTask() throws Exception {
        TaskDto updatedTaskDto = TaskDto.builder()
                .id(task1)
                .code("TASK-001")
                .status("IN_PROGRESS")
                .reporterId(aliceId)
                .assigneeId(bobId)
                .reporterName("alice")
                .assigneeName("bob")
                .summary("Test Task")
                .details("Details")
                .build();
        when(taskService.updateStatus(task1, "IN_PROGRESS")).thenReturn(updatedTaskDto);

        mockMvc.perform(patch("/tasks/{id}/status", task1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"IN_PROGRESS\"}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(task1.toString()))
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void updateTaskStatus_returnsNotFoundWhenTaskNotFound() throws Exception {
        when(taskService.updateStatus(task1, "IN_PROGRESS")).thenThrow(new TaskNotFoundException(task1));

        mockMvc.perform(patch("/tasks/{id}/status", task1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"IN_PROGRESS\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateTaskStatus_returnsBadRequestWhenStatusBlank() throws Exception {
        mockMvc.perform(patch("/tasks/{id}/status", task1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\": \"\"}"))
                .andExpect(status().isBadRequest());
    }
}
