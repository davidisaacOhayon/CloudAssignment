from fastapi import FastAPI, Depends
from pydantic import BaseModel
import random
import os
from typing import Annotated, List
from sqlmodel import Field, Session, SQLModel, create_engine, select
from datetime import datetime
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# --- ENV ---
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_CONN_STRING = os.getenv("DB_CONN_STRING")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = os.getenv("DB_PORT", "3306")
 


# For CORS allowed origins, you may need to set this manually.
origins = [
    "https://backend-dot-davidassignment.nw.r.appspot.com"
]


load_dotenv()


 
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@/{DB_NAME}?unix_socket=/cloudsql/{DB_CONN_STRING}"

 

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)

# --- DB SESSION ---
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

# --- MODEL ---
class Entry(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    version: str = Field(index=True)
    date: datetime = Field(default_factory=datetime.utcnow)
    instance: str
    number: int

# --- APP ---
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # allow all methods
    allow_headers=["*"],  # allow all headers
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# --- GENERATE ENDPOINT ---
@app.get("/generate/")
async def generate(
    session: SessionDep,
    batched: bool = False,
    batch_size: int = 1,
):
    ver = os.environ.get("GAE_VERSION", "v1")
    ins = os.environ.get("GAE_INSTANCE", "local")

    response = {
        "numbers": [],
        "instance_id": ins,
        "version": ver,
    }

    if batched:
        entries = []
        for _ in range(batch_size):
            entry = Entry(
                version=ver,
                instance=ins,
                number=random.randint(0, 10000)
            )
            entries.append(entry)
            response["numbers"].append(entry.number)

        session.add_all(entries)
        session.commit()

    else:
        entry = Entry(
            version=ver,
            instance=ins,
            number=random.randint(0, 10000)
        )
        session.add(entry)
        session.commit()
        session.refresh(entry)

        response["numbers"].append(entry.number)

    return response

# --- RESULTS ENDPOINT ---
@app.get("/results/")
async def results(session: SessionDep):
    entries: List[Entry] = session.exec(select(Entry)).all()

    return entries