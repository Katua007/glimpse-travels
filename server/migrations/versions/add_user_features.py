"""Add user features

Revision ID: add_user_features
Revises: add_password_hash
Create Date: 2025-01-27 14:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_user_features'
down_revision = 'add_password_hash'
branch_labels = None
depends_on = None

def upgrade():
    # Add new columns to users table
    op.add_column('users', sa.Column('bio', sa.String(500), nullable=True))
    op.add_column('users', sa.Column('rating', sa.Float(), nullable=True))
    op.add_column('users', sa.Column('wishlist', sa.Text(), nullable=True))

def downgrade():
    # Remove the columns
    op.drop_column('users', 'wishlist')
    op.drop_column('users', 'rating')
    op.drop_column('users', 'bio')