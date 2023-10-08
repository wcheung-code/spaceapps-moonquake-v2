FROM python:3.8-slim
WORKDIR /app
COPY api/main.py .
COPY requirements.txt .
RUN ls -al
RUN pip install --trusted-host pypi.python.org -r requirements.txt
EXPOSE 80
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "main:app"]
