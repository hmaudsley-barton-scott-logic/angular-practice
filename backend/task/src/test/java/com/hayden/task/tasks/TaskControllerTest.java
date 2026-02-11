package com.hayden.task.tasks;

import com.hayden.task.users.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    UUID task1 = UUID.randomUUID();
    UUID aliceId = UUID.randomUUID();
    User alice = User.builder().id(aliceId).userName("alice").build();
    UUID bobId = UUID.randomUUID();
    User bob = User.builder().id(bobId).userName("bob").build();

    @Test
    void getTasks_returnsTaskDtos() throws Exception {
        TaskDto taskDto = TaskDto.builder()
                .id(task1)
                .code("TASK-001")
                .status("To-Do")
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
                .status("To-Do")
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
}