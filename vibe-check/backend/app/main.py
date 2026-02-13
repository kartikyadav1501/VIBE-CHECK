from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Vibe Check API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load AI model
try:
    classifier = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli"
    )
    logging.info("Model loaded successfully")
except Exception as e:
    logging.error(f"Model loading failed: {e}")
    classifier = None


class Feedback(BaseModel):
    text: str


@app.get("/")
def health_check():
    return {"status": "Vibe Check Backend Running 🚀"}


@app.post("/analyze")
def analyze_feedback(feedback: Feedback):

    if not classifier:
        raise HTTPException(status_code=500, detail="Model not loaded")

    if not feedback.text.strip():
        raise HTTPException(status_code=400, detail="Feedback text cannot be empty")

    labels = ["Concern", "Appreciation", "Suggestion"]

    try:
        result = classifier(feedback.text, labels)

        category = result["labels"][0]
        confidence = round(float(result["scores"][0]), 3)

        # Save to Supabase
        supabase.table("feedbacks").insert({
            "text": feedback.text,
            "category": category,
            "confidence": confidence
        }).execute()

        return {
            "category": category,
            "confidence": confidence,
            "message": "Analysis saved successfully"
        }

    except Exception as e:
        logging.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Processing failed")


@app.get("/stats")
def get_stats():
    try:
        response = supabase.table("feedbacks").select("category").execute()

        data = response.data

        total = len(data)
        concern = sum(1 for item in data if item["category"] == "Concern")
        appreciation = sum(1 for item in data if item["category"] == "Appreciation")
        suggestion = sum(1 for item in data if item["category"] == "Suggestion")

        return {
            "total_feedback": total,
            "concern": concern,
            "appreciation": appreciation,
            "suggestion": suggestion
        }

    except Exception as e:
        logging.error(f"Stats error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch stats")

@app.get("/history")
def get_history():
    try:
        response = supabase.table("feedbacks") \
            .select("*") \
            .order("created_at", desc=True) \
            .limit(10) \
            .execute()

        return response.data

    except Exception as e:
        logging.error(f"History error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch history")
