import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()


url = os.getenv("SUPABASE_URL")
key = os.environ.get("API_KEY")
supabase: Client = create_client(url, key)

profile_data = (
    supabase.table("Profiles")
    .select("*")
    .execute()
)

def get_recipes():
    response = (
        supabase.table("Recipes")
        .select("id, recipe_title, ingredients, is_spicy, is_meat, is_sweet")
        .execute()
    )
    return response.data
