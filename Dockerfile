FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8
WORKDIR /app/api
COPY api /app
COPY requirements.txt /app
# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 80
# Run app.py when the container launches
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "main:app"]
