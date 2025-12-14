import time
from SupabaseHelper import supabase

# -----------------------------
# Keyword lists + synonyms
# -----------------------------
spicy_keywords = ["chili", "jalapeno", "cayenne", "ginger", "paprika"]
meats = ["chicken", "beef", "pork", "lamb", "fish", "shrimp"]
sweet_keywords = ["sugar", "honey", "maple syrup", "molasses", "agave syrup"]
sweet_synonyms = {
    "sugar": ["cane sugar", "powdered sugar", "granulated sugar", "white sugar"],
    "honey": ["raw honey", "liquid honey"],
    "maple syrup": ["pure maple syrup"],
}

# -----------------------------
# Helper functions
# -----------------------------
def is_spicy(ingredients):
    for ingredient in ingredients:
        if any(kw in ingredient.lower() for kw in spicy_keywords):
            return True
    return False

def is_meat(ingredients):
    for ingredient in ingredients:
        if any(kw in ingredient.lower() for kw in meats):
            return True
    return False

def is_sweet(ingredients):
    for ingredient in ingredients:
        ingredient_lower = ingredient.lower()
        if any(kw in ingredient_lower for kw in sweet_keywords):
            return True
        for syn_list in sweet_synonyms.values():
            if any(syn in ingredient_lower for syn in syn_list):
                return True
    return False

# -----------------------------
# Fetch all recipes in batches
# -----------------------------
def get_all_recipes(batch_size=1000):
    all_recipes = []
    start = 0

    while True:
        response = supabase.table("Recipes").select("*").range(start, start + batch_size).execute()
        batch = response.data
        if not batch:
            break
        all_recipes.extend(batch)
        start += batch_size
    return all_recipes

# -----------------------------
# Main pipeline
# -----------------------------
BATCH_SIZE = 50  # update batch size

def enrich_and_update_recipes():
    recipes = get_all_recipes()
    print(f"Total recipes fetched: {len(recipes)}")

    for i in range(0, len(recipes), BATCH_SIZE):
        batch = recipes[i:i + BATCH_SIZE]
        update_batch = []

        for recipe in batch:
            ingredients = recipe.get("ingredients", [])
            # ensure ingredients is a list
            if not isinstance(ingredients, list):
                continue

            update_batch.append({
                "id": recipe["id"],  # primary key for upsert
                "is_spicy": is_spicy(ingredients),
                "is_meat": is_meat(ingredients),
                "is_sweet": is_sweet(ingredients)
            })

        if update_batch:
            response = supabase.table("Recipes").upsert(update_batch).execute()
            if response.data is not None:
                print(f"Updated batch {i} to {i + len(batch)}")
            else:
                print(f"Failed to update batch {i} to {i + len(batch)}")

        # small delay to avoid rate limits
        time.sleep(0.1)

    print("All recipes updated!")

# -----------------------------
# Run pipeline
# -----------------------------
if __name__ == "__main__":
    enrich_and_update_recipes()
