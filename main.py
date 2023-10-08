import os
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import csv

current_directory = os.path.abspath(os.path.dirname(__file__))

csv_file_path = os.path.join(current_directory, "../obspy-analysis/Nakamura_1979_processed.csv")

app = FastAPI()

@app.post("/upload_csv/")
async def upload_csv():
    try:
        with open(csv_file_path, 'r') as file:
            csv_data = file.read()
        
        csv_rows = csv_data.split("\n")
        csv_reader = csv.DictReader(csv_rows)

        data = []
        for row in csv_reader:
            data.append({
                "Timestamp": row.get("Timestamp"),
                "Lat": row.get("Lat"),
                "Long": row.get("Long"),
                "Magnitude": row.get("Magnitude"),
                "Moonquake Type": row.get("Moonquake Type")
            })
        
        return JSONResponse(content={"status": "success", "filename": csv_file_path, "data": data}, media_type="application/json")
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, media_type="application/json")
