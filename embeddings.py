from sentence_transformers import SentenceTransformer, SimilarityFunction
import tf_keras as keras
import json
import numpy as np
import torch
from SupabaseHelper import supabase
import time

headers = [
    "Top Picks For You",
    "Quick & Easy",
    "Comfort Food Cravings",
    "Healthy & Light",
    "Meat Lovers",
    "Veggie Favorites",
    "World Flavors",
]

embedding_dim = 384

# # Load a small, fast model
model = SentenceTransformer('all-MiniLM-L6-v2')


BATCH_SIZE = 50

page_size = 1000
offset = 0

# add pagination
while True:
    response = (
        supabase
        .table("Recipes")
        .select("id", "ingredients", "category", "subcategory")
        .range(offset, offset + page_size - 1)
        .execute()
    )

    data = response.data
    if not data:
        break

    recipe_texts = []
    recipe_ids = []

    for recipe in response.data:
        recipe_ids.append(recipe["id"])
        text = ", ".join(recipe["ingredients"])
        if recipe.get("subcategory"):
            text += f". Dietary type: {recipe['subcategory']}."
        recipe_texts.append(text)
        # embedding = model.encode(recipe_text)
        
    # Encode all recipes in batches (faster)
    embeddings = model.encode(recipe_texts, batch_size=64, 
                show_progress_bar=True, convert_to_tensor=True)

    for i in range(0, len(embeddings), BATCH_SIZE):
        batch_embeddings = embeddings[i: i + BATCH_SIZE]
        batch_ids = recipe_ids[i: i + BATCH_SIZE]
        update_batch  = []

        for recipe_id, embedding in zip(batch_ids, batch_embeddings):
            update_batch.append({
                "recipe_id": recipe_id,
                "embedding": embedding.tolist()
            })

        if update_batch:
            response = supabase.table("recipe_embeddings").upsert(update_batch).execute()
            if response.data is not None:
                print(f"Updated batch {i} to {i + len(update_batch)}")
            else:
                print(f"Failed to update batch {i} to {i + len(update_batch)}")
            
        # small delay to avoid rate limits
        time.sleep(0.1)

    offset += page_size


recipe_ids = [
    
]

for recipe in data:
    recipe_ids.append(recipe["id"])
