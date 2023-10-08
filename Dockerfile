FROM python:3.8 as builder
WORKDIR /app
COPY api/main.py .

FROM python:3.8
WORKDIR /app
COPY --from=builder /app/main.py .
COPY requirements.txt .
RUN pip install -r requirements.txt
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "main:app"]
