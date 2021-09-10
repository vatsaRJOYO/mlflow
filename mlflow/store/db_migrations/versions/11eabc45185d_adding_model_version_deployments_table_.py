"""adding model version deployments table to db

Revision ID: 11eabc45185d
Revises: c48cb773bb87
Create Date: 2021-09-09 06:17:34.416626

"""
from mlflow.store.model_registry.dbmodels.models import SqlModelVersionDeployment
from alembic import op
import sqlalchemy as sa
import time


# revision identifiers, used by Alembic.
revision = '11eabc45185d'
down_revision = 'c48cb773bb87'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        SqlModelVersionDeployment.__tablename__,
        sa.Column("id", sa.BigInteger, primary_key=True, autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=256), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False),
        sa.Column("environment", sa.String(length=32), nullable=False),
        sa.Column("service_name", sa.String(length=32), nullable=False),
        sa.Column("jira_id", sa.String(length=32)),
        sa.Column("status", sa.String(length=32)),
        sa.Column("message", sa.String()),
        sa.Column("job_url", sa.String()),
        sa.Column("helm_url", sa.String(length=256)),
        sa.Column("cpu", sa.String(length=16)),
        sa.Column("memory", sa.String(length=16)),
        sa.Column("initial_delay", sa.String(length=32)),
        sa.Column("overwrite", sa.Boolean(), nullable=False, default=False),
        sa.Column("creation_time", sa.BigInteger, default=lambda: int(time.time() * 1000)),
        sa.Column("last_updated_time", sa.BigInteger, nullable=True, default=None),

        sa.ForeignKeyConstraint(
            ("name", "version"),
            ("model_versions.name", "model_versions.version"),
            onupdate="cascade",
        ),
    )


def downgrade():
    pass
