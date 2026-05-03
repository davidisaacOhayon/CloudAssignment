from fastapi import FastAPI, Depends
from pydantic import BaseModel
import random
import math
import os
from typing import Annotated, List
from sqlmodel import Field, Session, SQLModel, create_engine, select, func
from datetime import datetime
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import time

START_TIME = datetime.utcnow().isoformat()

load_dotenv()
# --- ENV ---
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_CONN_STRING = os.getenv("DB_CONN_STRING")
DB_NAME = os.getenv("DB_NAME")
DB_PORT = os.getenv("DB_PORT", "3306")
 


# For CORS allowed origins, you may need to set this manually.
origins = [
    "https://frontend-dot-davidassignment.nw.r.appspot.com"
]


# SQL Connection string
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
@app.post("/generate/")
async def generate(
    session: SessionDep,
    batched: bool = False,
    batch_size: int = 0,
):
    ver = os.environ.get("GAE_VERSION", "v1")
    ins = os.environ.get("GAE_INSTANCE", "local")
    
 
    response = {
        "numbers": [],
        "instance_id": ins,
        "version": ver,
        "start_time" : START_TIME
    }

    # Cause some random stress for CPU work
    for _ in range(9999999):
        math.sqrt(random.random() * 1000000)
        
    if batched:
        entries = []
        for _ in range(batch_size):
            entry = Entry(
                version=ver,
                instance=ins,
                number=random.randint(0, 100000)
            )
            entries.append(entry)
            response["numbers"].append(entry.number)
        time.sleep(1)
        session.add_all(entries)
        session.commit()

    else:
        entry = Entry(
            version=ver,
            instance=ins,
            number=random.randint(0, 10000)
        )
        time.sleep(1)
        session.add(entry)
        session.commit()
        session.refresh(entry)

        response["numbers"].append(entry.number)

    return response

# --- RESULTS ENDPOINT ---
@app.get("/results/")
async def results(session: SessionDep):
    query = select(Entry.instance, Entry.version, func.count(Entry.id), func.min(Entry.number), func.max(Entry.number)).group_by(Entry.instance, Entry.version)
    entries: List[Entry] = session.exec(query).all()
    stats = [{
        "instance": inst,
        "version": ver,
        "total": count,
        "minimum": mini,
        "maximum": maxi,
        "start_time" : START_TIME
    } for inst, ver, count, mini, maxi in entries]

    smallest = session.exec(select(Entry.instance, Entry.number).order_by(Entry.number.asc())).first()
    biggest  = session.exec(select(Entry.instance, Entry.number).order_by(Entry.number.desc())).first()

    print(f'Retrieving ${stats}')
    response = {
        "distribution": stats,
        "smallest": {"instance" : smallest[0], "number" : smallest[1]},
        "biggest": {"instance" : biggest[0], "number" : biggest[1]}
    }

    return response