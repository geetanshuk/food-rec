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

# Create a random user preference embedding
user_query = user_query = "chicken, garlic, butter, pasta"
user_embedding = model.encode(user_query, convert_to_tensor=True)


INPUT_FILE = "datasets/recipes_processed.json"
# OUTPUT_FILE = "datasets/recipes_with_embeddings.json"



BATCH_SIZE = 50

page_size = 1000
offset = 0

# add pagination
while True:
    print(offset)
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
    embeddings = model.encode(recipe_texts, batch_size=64, show_progress_bar=True, convert_to_tensor=True)

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


# recipe_ids = [
    
# ]

# for recipe in data:
#     recipe_ids.append(recipe["id"])

# # find cosine similarity between user embeddings and dataset
# similarity_fn = SimilarityFunction.to_similarity_fn("cosine")
# # recipe.ingredients correspond to embeddings
# similarity_scores = list(zip(similarity_fn(embeddings, user_embedding), recipe_ids))
# print(similarity_scores)
# sorted_sim_scores = sorted(similarity_scores, reverse=True)

# similarities = model.similarity(embeddings, user_embedding)

# # map for similarity index and value
# emb_to_similar = {}

# pairs = list(zip(similarities.tolist(), recipe_ids))

# pairs.sort(key=lambda x: x[0], reverse=True)

# # the last 10, "you'll like the most"
# fav = []
# two_fav = []
# three_fav = []
# four_fav = []
# five_fav = []
# count = 0
# for score, recipe_id in pairs[:50]:
#     if count < 10:
#         fav.append(recipe_id)
#     elif count > 10 and count <= 20:
#         two_fav.append(recipe_id)
#     elif count > 20 and count <= 30:
#         three_fav.append(recipe_id)
#     elif count > 30 and count <= 40:
#         four_fav.append(recipe_id)
#     elif count <= 50:
#         five_fav.append(recipe_id)
#     count += 1

# print(fav)
# print("------------------")
# print(two_fav)
# print("------------------")
# print(three_fav)
# print("------------------")
# print(four_fav)
# print("------------------")
# print(five_fav)
