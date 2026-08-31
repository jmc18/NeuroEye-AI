"""clinical_domain

Revision ID: a1b2c3d4e5f6
Revises: f8e2a1b3c4d5
Create Date: 2026-08-31 15:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "f8e2a1b3c4d5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _entity_columns() -> list[sa.Column]:
    return [
        sa.Column("id", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("is_deleted", sa.Boolean(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    op.add_column("patients", sa.Column("sex", sa.String(length=20), nullable=True))
    op.add_column("patients", sa.Column("notes", sa.Text(), nullable=True))

    op.create_table(
        "test_presets",
        sa.Column("tenant_id", sa.String(length=255), nullable=False),
        sa.Column("code", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("description", sa.String(length=500), nullable=True),
        sa.Column("config", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        *_entity_columns(),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_test_presets_tenant_id"), "test_presets", ["tenant_id"])
    op.create_index(op.f("ix_test_presets_code"), "test_presets", ["code"])

    op.create_table(
        "screening_sessions",
        sa.Column("tenant_id", sa.String(length=255), nullable=False),
        sa.Column("patient_id", sa.String(length=255), nullable=False),
        sa.Column("clinician_id", sa.String(length=255), nullable=False),
        sa.Column("preset_id", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("abort_reason", sa.String(length=255), nullable=True),
        *_entity_columns(),
        sa.ForeignKeyConstraint(["tenant_id"], ["tenants.id"]),
        sa.ForeignKeyConstraint(["patient_id"], ["patients.id"]),
        sa.ForeignKeyConstraint(["clinician_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["preset_id"], ["test_presets.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_screening_sessions_tenant_id"), "screening_sessions", ["tenant_id"])
    op.create_index(op.f("ix_screening_sessions_patient_id"), "screening_sessions", ["patient_id"])
    op.create_index(op.f("ix_screening_sessions_clinician_id"), "screening_sessions", ["clinician_id"])
    op.create_index(op.f("ix_screening_sessions_preset_id"), "screening_sessions", ["preset_id"])
    op.create_index(op.f("ix_screening_sessions_status"), "screening_sessions", ["status"])

    op.create_table(
        "gaze_samples",
        sa.Column("session_id", sa.String(length=255), nullable=False),
        sa.Column("t_ms", sa.Integer(), nullable=False),
        sa.Column("x_norm", sa.Float(), nullable=False),
        sa.Column("y_norm", sa.Float(), nullable=False),
        sa.Column("eye_detected", sa.Boolean(), nullable=False),
        sa.Column("fps", sa.Float(), nullable=False),
        sa.Column("quality", sa.Float(), nullable=False),
        *_entity_columns(),
        sa.ForeignKeyConstraint(["session_id"], ["screening_sessions.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_gaze_samples_session_id"), "gaze_samples", ["session_id"])

    op.create_table(
        "session_metrics",
        sa.Column("session_id", sa.String(length=255), nullable=False),
        sa.Column("sample_count", sa.Integer(), nullable=False),
        sa.Column("mean_fps", sa.Float(), nullable=False),
        sa.Column("detection_rate", sa.Float(), nullable=False),
        sa.Column("mean_latency_ms", sa.Float(), nullable=False),
        sa.Column("fixation_stability", sa.Float(), nullable=False),
        sa.Column("saccade_amplitude", sa.Float(), nullable=False),
        sa.Column("extras", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        *_entity_columns(),
        sa.ForeignKeyConstraint(["session_id"], ["screening_sessions.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("session_id"),
    )
    op.create_index(op.f("ix_session_metrics_session_id"), "session_metrics", ["session_id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_session_metrics_session_id"), table_name="session_metrics")
    op.drop_table("session_metrics")
    op.drop_index(op.f("ix_gaze_samples_session_id"), table_name="gaze_samples")
    op.drop_table("gaze_samples")
    op.drop_index(op.f("ix_screening_sessions_status"), table_name="screening_sessions")
    op.drop_index(op.f("ix_screening_sessions_preset_id"), table_name="screening_sessions")
    op.drop_index(op.f("ix_screening_sessions_clinician_id"), table_name="screening_sessions")
    op.drop_index(op.f("ix_screening_sessions_patient_id"), table_name="screening_sessions")
    op.drop_index(op.f("ix_screening_sessions_tenant_id"), table_name="screening_sessions")
    op.drop_table("screening_sessions")
    op.drop_index(op.f("ix_test_presets_code"), table_name="test_presets")
    op.drop_index(op.f("ix_test_presets_tenant_id"), table_name="test_presets")
    op.drop_table("test_presets")
    op.drop_column("patients", "notes")
    op.drop_column("patients", "sex")
