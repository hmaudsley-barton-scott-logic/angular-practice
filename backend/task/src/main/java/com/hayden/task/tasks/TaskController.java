package com.hayden.task.tasks;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("tasks")
public class TaskController {
    private TaskService postService;

    @GetMapping
    public List<TaskDto> getTasks() {
        return postService.getAllTasks();
    }
}
