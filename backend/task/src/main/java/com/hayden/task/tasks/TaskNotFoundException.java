package com.hayden.task.tasks;

import java.util.UUID;

public class TaskNotFoundException extends RuntimeException {
    public TaskNotFoundException(UUID id) {
        super("Task with Id" + id + "not found");
    }
}
