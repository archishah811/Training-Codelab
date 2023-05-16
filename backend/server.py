from fastapi import FastAPI, Request
from fastapi_utils.tasks import repeat_every
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import json 
from datetime import datetime
from constants import CORS_URLS
from bitcoin_timestamp import BitcoinTimestamp
from custom_util import get_live_bitcoin_price, convert_date_to_text
from database_connection import DatabaseConnection

# from fastapi import FastAPI
from sqlalchemy.orm import Session
from fastapi_utils.session import FastAPISessionMaker
# from fastapi_utils.tasks import repeat_every

database_uri = f"sqlite:///./test.db?check_same_thread=False"
sessionmaker = FastAPISessionMaker(database_uri)

# TODO (3.1): define FastAPI app
app = FastAPI()
# TODO (5.4.1): define database connection
dataconnection = DatabaseConnection()

# TODO (3.2): add CORS middleware
CORS_URLS=[
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_URLS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# TODO (3.1)
"""
a index function to test if server is running
"""
@app.get("/")
async def root():
    content = {"message": "Hello World! This is a bitcoin monitoring service!"}
    return json.dumps(content)

# TODO (5.4.2)
"""
repeated task to update bitcoin prices periodically
"""
@app.route('/')
def update_bitcoin_price(db:Session) -> None:
    
    # instanceDBC = DatabaseConnection()
    if (get_live_bitcoin_price() > 0 ):
        instanceBT = BitcoinTimestamp(convert_date_to_text(datetime.now()), get_live_bitcoin_price())
        dataconnection.insert_timestamp(instanceBT)
        
    else:
        print("API call failed and get_live_bitcoin_price() function returned 0.0")

@app.on_event("startup")
@repeat_every(seconds=5)  # 5 seconds
def update_bitcoin_price_task() -> None:
    with sessionmaker.context_session() as db:
        update_bitcoin_price(db=db)

# TODO (5.4.3)
"""
API endpoint to get bitcoin prices

:return:
    a list of bitcoinstamps
:rtype:
    json
"""

@app.get("/get_bitcoin_prices")
async def get_bitcoin_prices():
    dictlist = []
    for ts in dataconnection.get_all_timestampes():
        dictlist.append(vars(ts))
    return json.dumps(dictlist) 
    
# main function to run the server
if __name__ == '__main__':
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
