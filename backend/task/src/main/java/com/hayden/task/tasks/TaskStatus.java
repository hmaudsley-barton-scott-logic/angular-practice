package com.hayden.task.tasks;

public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    IN_REVIEW,
    DONE,
    CANCELLED;

    public static boolean isValid(String value) {
        if (value == null) {
            return false;
        }
        try {
            TaskStatus.valueOf(value);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
