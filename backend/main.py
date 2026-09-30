from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from ml_service import parse_resume_for_skills

app = FastAPI(title="CareerForge ML API")

# Configure CORS so the React frontend can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "CareerForge ML API is running"}

@app.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pdf', '.doc', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOC/DOCX files are supported")
    
    # Save the file temporarily
    os.makedirs("temp", exist_ok=True)
    temp_path = f"temp/{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Call the ML service to parse the resume
        skills = parse_resume_for_skills(temp_path)
        
        return {
            "filename": file.filename,
            "extracted_skills": skills,
            "message": "Resume parsed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/competency-mapping/match")
async def match_trainers_for_subject(data: dict):
    """
    Computes competency match percentage between subject requirements and trainer skills.
    """
    subject_skills = set(s.lower() for s in data.get("subject_skills", []))
    trainers = data.get("trainers", [])
    
    ranked_trainers = []
    for t in trainers:
        trainer_skills = set(s.lower() for s in t.get("skills", []))
        if subject_skills:
            intersection = subject_skills.intersection(trainer_skills)
            match_score = round((len(intersection) / len(subject_skills)) * 100)
        else:
            match_score = 80
        
        ranked_trainers.append({
            "trainer_id": t.get("id"),
            "trainer_name": t.get("name"),
            "competency_score": match_score,
            "rating": t.get("rating", 4.8),
            "verified_certifications": len(t.get("certifications", []))
        })
        
    ranked_trainers.sort(key=lambda x: x["competency_score"], reverse=True)
    return {"subject_id": data.get("subject_id"), "ranked_trainers": ranked_trainers}

@app.post("/api/assessments/evaluate")
async def evaluate_assessment(data: dict):
    """
    Grades submitted MCQ answers against answer keys and generates performance analytics.
    """
    questions = data.get("questions", [])
    answers = data.get("answers", {})  # { question_id: selected_index }
    
    total_marks = 0
    earned_marks = 0
    breakdown = []
    
    for q in questions:
        q_id = q.get("id")
        q_marks = q.get("marks", 5)
        correct_index = q.get("correct_option_index", 0)
        selected_index = answers.get(q_id)
        is_correct = selected_index == correct_index
        
        total_marks += q_marks
        if is_correct:
            earned_marks += q_marks
            
        breakdown.append({
            "question_id": q_id,
            "is_correct": is_correct,
            "correct_option_index": correct_index,
            "selected_option_index": selected_index,
            "explanation": q.get("explanation", "")
        })
        
    percentage = round((earned_marks / total_marks) * 100) if total_marks > 0 else 0
    passing_pct = data.get("passing_percentage", 70)
    
    return {
        "earned_marks": earned_marks,
        "total_marks": total_marks,
        "percentage": percentage,
        "passed": percentage >= passing_pct,
        "breakdown": breakdown
    }
