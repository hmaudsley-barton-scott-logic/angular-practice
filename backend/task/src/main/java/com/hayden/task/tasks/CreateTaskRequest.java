package com.hayden.task.tasks;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {

    @NotBlank(message = "Summary is required")
    private String summary;

    private String details;

    @NotNull(message = "Assignee ID is required")
    private UUID assigneeId;

    @NotNull(message = "Reporter ID is required")
    private UUID reporterId;

    private LocalDate dueDate;
}
