from fastapi import APIRouter, FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import Request

app=FastAPI(title="Web app")

templates=Jinja2Templates(directory="static")
general_pages_router=APIRouter()
@general_pages_router.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html",{"request":request})

app.include_router(general_pages_router)