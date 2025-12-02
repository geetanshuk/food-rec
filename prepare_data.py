import json
import time


INPUT_FILE = "datasets/train.json"
OUTPUT_FILE = "recipes_with_names.json"

spicy_keywords = ["chili", "jalapeno", "cayenne", "ginger", "paprika"]
meats = ["chicken", "beef", "pork", "lamb", "fish", "shrimp"]
sweet_keywords = [
    "sugar",
    "brown sugar",
    "powdered sugar",
    "cane sugar",
    "honey",
    "maple syrup",
    "corn syrup",
    "molasses",
    "agave syrup"
]

user_preferences = ["likes sweet", "is vegetarian"]


# Load data
def is_spicy(ingredients):
    for ingredient in ingredients:
        if ingredient in spicy_keywords:
            return True
    return False
        
def is_meat(ingredients):
    for ingredient in ingredients:
        if ingredient in meats:
            return True
    return False

def is_sweet(ingredients):
    for ingredient in ingredients:
        if ingredient in sweet_keywords:
            return True
    return False


with open(INPUT_FILE, "r") as f:
    data = json.load(f)

for recipe in data:
    recipe["spicy"] = is_spicy(recipe["ingredients"])
    recipe["non-veg"] = is_meat(recipe["ingredients"])
    recipe.setdefault("cook_time", 30)
    recipe["is_sweet"] = is_sweet(recipe["ingredients"])

# Try resume from partially completed output
with open("recipes_processed.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
        