package com.hayden.task.tasks;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request DTO for updating task status.
 * Single responsibility: carries only status update data.
 *
 * The status value must match a valid {@link TaskStatus} enum name.
 */
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusUpdateRequest {
    
    @NotBlank(message = "Status is required")
    private String status;
}
