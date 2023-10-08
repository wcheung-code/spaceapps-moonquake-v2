FROM python:3.8-slim
WORKDIR /app
RUN git clone --single-branch --branch main https://github.com/wcheung-code/spaceapps-moonquake-v2 /tmp/main-repo
RUN git clone --single-branch --branch obspy-analysis https://github.com/wcheung-code/spaceapps-moonquake-v2 /tmp/obspy-analysis-repo
WORKDIR /app
COPY /tmp/main-repo/main.py .
COPY /tmp/obspy-analysis-repo/Nakamura_1979_processed.csv .
RUN pip install --trusted-host pypi.python.org -r requirements.txt
EXPOSE 80
ENV NAME World
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "80", "main:app"]
