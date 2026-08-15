package com.releaseops.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "deployments")
public class Deployment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private SoftwareService service;

    @Column(nullable = false, length = 100)
    private String version;

    @Column(name = "commit_sha", nullable = false, length = 64)
    private String commitSha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeploymentEnvironment environment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeploymentStatus status;

    @Column(name = "triggered_by", length = 120)
    private String triggeredBy;

    @Column(name = "deployed_at", nullable = false)
    private Instant deployedAt;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "pipeline_run_url", length = 500)
    private String pipelineRunUrl;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Deployment() {
    }

    @PrePersist
    public void beforeCreate() {
        Instant now = Instant.now();

        if (deployedAt == null) {
            deployedAt = now;
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void beforeUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public SoftwareService getService() {
        return service;
    }

    public void setService(SoftwareService service) {
        this.service = service;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getCommitSha() {
        return commitSha;
    }

    public void setCommitSha(String commitSha) {
        this.commitSha = commitSha;
    }

    public DeploymentEnvironment getEnvironment() {
        return environment;
    }

    public void setEnvironment(DeploymentEnvironment environment) {
        this.environment = environment;
    }

    public DeploymentStatus getStatus() {
        return status;
    }

    public void setStatus(DeploymentStatus status) {
        this.status = status;
    }

    public String getTriggeredBy() {
        return triggeredBy;
    }

    public void setTriggeredBy(String triggeredBy) {
        this.triggeredBy = triggeredBy;
    }

    public Instant getDeployedAt() {
        return deployedAt;
    }

    public void setDeployedAt(Instant deployedAt) {
        this.deployedAt = deployedAt;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getPipelineRunUrl() {
        return pipelineRunUrl;
    }

    public void setPipelineRunUrl(String pipelineRunUrl) {
        this.pipelineRunUrl = pipelineRunUrl;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}