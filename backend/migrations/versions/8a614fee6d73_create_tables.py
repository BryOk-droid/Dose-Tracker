"""Create tables

Revision ID: 8a614fee6d73
Revises: 
Create Date: 2025-06-27 16:43:19.062233

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8a614fee6d73'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('medications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('current_stock', sa.Integer(), nullable=False),
    sa.Column('threshold', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('patients',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=50), nullable=False),
    sa.Column('last_name', sa.String(length=50), nullable=False),
    sa.Column('date_of_birth', sa.Date(), nullable=False),
    sa.Column('medical_record_number', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('medical_record_number')
    )
    op.create_table('dosages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('medication_id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=False),
    sa.Column('dosage_amount', sa.Float(), nullable=False),
    sa.Column('dosage_time', sa.DateTime(), nullable=False),
    sa.Column('administered_by', sa.String(length=100), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['medication_id'], ['medications.id'], ),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('dosages')
    op.drop_table('patients')
    op.drop_table('medications')
    # ### end Alembic commands ###
