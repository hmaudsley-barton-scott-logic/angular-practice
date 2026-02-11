package com.hayden.task.tasks;

import com.hayden.task.users.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @Column
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String status;

    @Column
    private String summary;

    @Column
    private String details;

    @Column
    private OffsetDateTime creationDate;

    @Column
    private OffsetDateTime updatedDate;

    @Column
    private OffsetDateTime dueDate;

    @OneToMany(mappedBy = "superTask")
    private List<Task> subtasks;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @ManyToOne
    @JoinColumn(name = "super_task")
    private Task superTask;


    public TaskDto toDto() {
        return TaskDto.builder()
                .id(this.getId())
                .code(this.getCode())
                .status(this.getStatus())
                .reporterId(this.getReporter().getId())
                .assigneeId(this.getAssignee().getId())
                .reporterName(this.getReporter().getUserName())
                .assigneeName(this.getAssignee().getUserName())
                .details(this.getDetails())
                .summary(this.getSummary())
                .updatedDate(this.getUpdatedDate())
                .creationDate(this.getCreationDate())
                .dueDate(this.getDueDate())
                .build();
    }
}
