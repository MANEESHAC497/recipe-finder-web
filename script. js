const API_KEY = "YOUR_API_KEY";
async function searchRecipes() {
    const query = document.getElementById("searchInput").value.trim();
    const list = document.getElementById("recipeList");

    if (!query) {
        alert("Please enter a recipe name");
        return;
    }

    list.innerHTML = "<p>Loading recipes...</p>";

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("API request failed: " + response.status);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            list.innerHTML = "<p>No recipes found!</p>";
            return;
        }

        list.innerHTML = "";

        data.results.forEach(recipe => {
            list.innerHTML += `
                <div class="recipe-card">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <h3>${recipe.title}</h3>
                    <p>Ready in: ${recipe.readyInMinutes || "N/A"} minutes</p>
                    <button onclick="showRecipe(${recipe.id})">
                        View Recipe
                    </button>
                </div>
            `;
        });

    } catch (error) {
        list.innerHTML = "<p>Unable to load recipes. Please try again.</p>";
        console.error(error);
    }
}

async function showRecipe(id) {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Recipe details unavailable");
        }

        const recipe = await response.json();

        alert(
            recipe.title + "\n\n" +
            "Ingredients:\n" +
            recipe.extendedIngredients.map(i => i.original).join("\n") +
            "\n\nInstructions:\n" +
            (recipe.instructions || "No instructions available")
        );

    } catch (error) {
        alert("Unable to load recipe details.");
    }
}

