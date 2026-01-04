from sentence_transformers import SimilarityFunction, SentenceTransformer
from SupabaseHelper import supabase

# # Load a small, fast model
model = SentenceTransformer('all-MiniLM-L6-v2')

import torch

def generate(user_embedding, recipe_embeddings, recipe_ids, top_n=10):
    """
    user_embedding: torch.Tensor
    recipe_embeddings: list of torch.Tensor
    recipe_ids: list of corresponding recipe IDs
    top_n: number of top recommendations to return
    """

    # Ensure user_embedding has same shape
    user_embedding = user_embedding.mean(dim=0)  # shape: [1, embedding_dim]
    print(f"User embedding shape: {user_embedding.shape}")
    print(f"Recipe embeddings shape: {recipe_embeddings.shape}")

    # Cosine similarity
    similarities = torch.nn.functional.cosine_similarity(user_embedding, recipe_embeddings)
    
    # Get top indices
    top_indices = torch.topk(similarities, k=top_n).indices.tolist()

    # Map to recipe IDs
    top_recipes = [recipe_ids[i] for i in top_indices]

    # recipe id's to names
    # need ingredients, directions, category, subcategory
    recipe_response = supabase.table("Recipes").select("id, recipe_title").in_("id", top_recipes).execute()
    recipe_data = recipe_response.data

    return recipe_data
