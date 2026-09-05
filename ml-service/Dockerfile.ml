FROM python:3.12-slim

WORKDIR /app

COPY requirements-common.txt requirements-linux.txt ./

RUN pip install --no-cache-dir -r requirements-linux.txt

COPY api ./api
COPY models ./models

EXPOSE 8001

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8001"]