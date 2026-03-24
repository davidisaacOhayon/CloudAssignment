from fastapi import FastAPI
from pydantic import BaseModel
from contextlib import asynccontextmanager
import random
import json
import os





class NumberRequest(BaseModel):
    batch_size : int

app = FastAPI()

results = {
    "numbers": [],
    "instance_id" : os.environ.get("GAE_INSTANCE", "local"),
    "version" : os.environ.get("GAE_VERSION", "v1"),
}


 
@app.post("/generate/")
async def generate(batched: bool = False):
    if batched:
        batch = 5 
        results["numbers"].extend([random.randint(0, 10000) for x in range(0, batch)]) 
    else:
        results["numbers"].append(random.randint(0, 10000))

    return results

@app.get("/results/")
async def results():
    response = results
    response["largest_number"] = max(results["numbers"])
    return response

