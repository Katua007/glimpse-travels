"""Add password hash column

Revision ID: add_password_hash
Revises: 0e07628e1192
Create Date: 2025-01-27 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_password_hash'
down_revision = '0e07628e1192'
branch_labels = None
depends_on = None

def upgrade():
    # Add the _password_hash column to users table
    op.add_column('users', sa.Column('_password_hash', sa.String(), nullable=True))

def downgrade():
    # Remove the _password_hash column from users table
    op.drop_column('users', '_password_hash')