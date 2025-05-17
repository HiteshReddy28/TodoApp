from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from test import database, users
import sqlalchemy

# Define the FastAPI app
app = FastAPI()

# Pydantic models for request and response validation
class UserIn(BaseModel):
    name: str
    email: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str

# Event handlers for connecting and disconnecting the database
@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# API endpoint to fetch all users
@app.get("/users", response_model=list[UserOut])
async def get_users():
    query = users.select()
    return await database.fetch_all(query)

# API endpoint to add a new user
@app.post("/users", response_model=UserOut)
async def create_user(user: UserIn):
    # Check if the email already exists
    query = users.select().where(users.c.email == user.email)
    existing_user = await database.fetch_one(query)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Insert the new user into the database
    query = users.insert().values(name=user.name, email=user.email)
    new_user_id = await database.execute(query)

    return { "id": new_user_id, "name": user.name, "email": user.email }
