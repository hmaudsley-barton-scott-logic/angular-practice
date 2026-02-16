package com.hayden.task.tasks;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private UUID id;

    private String code;

    private String status;

    private UUID reporterId;

    private UUID assigneeId;

    private String reporterName;

    private String assigneeName;

    private String summary;

    private String details;

    private OffsetDateTime creationDate;

    private OffsetDateTime updatedDate;

    private OffsetDateTime dueDate;
}
