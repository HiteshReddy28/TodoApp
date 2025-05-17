import os
from dotenv import load_dotenv
from databases import Database
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

database = Database(DATABASE_URL)

# Initialize SQLAlchemy engine and metadata
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Define a table
users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100)),
    Column("email", String(100), unique=True),
)

# Create the table in PostgreSQL if it doesn't exist
metadata.create_all(engine)