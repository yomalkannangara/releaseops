CREATE TABLE app_users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('ADMIN', 'ENGINEER', 'VIEWER')),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    repository_url VARCHAR(500),
    production_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'HEALTHY'
        CHECK (status IN ('HEALTHY', 'DEGRADED', 'DOWN', 'MAINTENANCE')),
    created_by BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL
        CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN'
        CHECK (status IN ('OPEN', 'INVESTIGATING', 'MONITORING', 'RESOLVED')),
    reported_by BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
    assigned_to BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deployments (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    version VARCHAR(100) NOT NULL,
    commit_sha VARCHAR(64) NOT NULL,
    environment VARCHAR(20) NOT NULL
        CHECK (environment IN ('DEVELOPMENT', 'STAGING', 'PRODUCTION')),
    status VARCHAR(20) NOT NULL
        CHECK (status IN ('PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED', 'ROLLED_BACK')),
    triggered_by VARCHAR(120),
    deployed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INTEGER CHECK (duration_seconds >= 0),
    pipeline_run_url VARCHAR(500),
    failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_incidents_service_id ON incidents(service_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_deployments_service_id ON deployments(service_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_deployed_at ON deployments(deployed_at DESC);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
