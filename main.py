from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SimilarityFunction, SentenceTransformer
from SupabaseHelper import supabase
from generatePref import generate
import torch
import ast

app = FastAPI()

model = SentenceTransformer('all-MiniLM-L6-v2')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRequest(BaseModel):
    id: str
    name: str
    preferences: list[str]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/recommend")
def recommend(body: UserRequest):
    id = body.id
    name = body.name
    preferences = body.preferences
    # need to insert preferences into the database
    supabase.table("Profiles").upsert({
        "id": id,
        "name": name,
        "preferences": preferences
    }).execute()

    response = supabase.table("recipe_embeddings").select(
        "embedding", "recipe_id").execute()
    data = response.data
    embedding = []
    recipe_ids = []
    for d in data:
        emb = d["embedding"]
        r = d["recipe_id"]

        # converts to a list
        if isinstance(emb, str):
            emb = ast.literal_eval(emb)
            

        embedding.append(torch.tensor(emb, dtype=torch.float32))
        recipe_ids.append(r)
    embedding_matrix = torch.stack(embedding)
    print("embeddings matrix length", len(embedding_matrix))

    # compute user embedding
    user_embedding = model.encode(preferences, convert_to_tensor=True)


    # 4) compute cosine similarity
    fav = generate(user_embedding, embedding_matrix, recipe_ids)
    return {"top_recipes": fav}

