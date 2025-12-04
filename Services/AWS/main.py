from fastapi import FastAPI, Request, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
import time
app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

# Serve static files
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "static"),
    name="static"
)

# Your HTML lives inside static/
templates = Jinja2Templates(directory=str(BASE_DIR / "static"))

router = APIRouter()

@router.get("/item")
async def item(request :Request ,item:int):
    time.sleep(0.1)
    return {"item":item}
@router.get("/")
async def home(request: Request):
    time.sleep(1.5)
    return templates.TemplateResponse("index.html", {"request": request})

app.include_router(router)
