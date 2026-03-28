from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager
import random
import json
import os





class NumberRequest(BaseModel):
    batch_size : int

app = FastAPI()

 


 
@app.get("/generate/")
async def generate(batched: bool = False, batch_size: int = 1):
    

    response = {
        "numbers": [],
        "instance_id" : os.environ.get("GAE_INSTANCE", "local"),
        "version" : os.environ.get("GAE_VERSION", "v1"),
    }
    if batched:
        for _ in range(0, batch_size):
          response["numbers"].extend([random.randint(0, 10000) for x in range(0, 100000)]) 
    else:
        response["numbers"].append(random.randint(0, 100000))

    return response

@app.get("/results/")
async def results():
    response = results
    response["largest_number"] = max(results["numbers"])
    return response

