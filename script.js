async function searchRecipes() {
    const query = document.getElementById("searchInput").value.trim();
    const list = document.getElementById("recipeList");

    if (!query) {
        alert("Enter a recipe name");
        return;
    }

    list.innerHTML = "<p>Loading recipes...</p>";

    try {
        const response = await fetch(
            `/api/recipes?query=${encodeURIComponent(query)}`
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();

        list.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            list.innerHTML = "<p>No recipes found!</p>";
            return;
        }

        data.results.forEach(recipe => {
            list.innerHTML += `
                <div class="recipe-card">
                    <img src="${recipe.image}" alt="Recipe">
                    <h3>${recipe.title}</h3>
                    <button onclick="showRecipe(${recipe.id})">
                        View Recipe
                    </button>
                </div>
            `;
        });

    } catch (error) {
        list.innerHTML = "<p>Unable to load recipes. Try again.</p>";
    }
}

async function showRecipe(id) {
    try {
        const response = await fetch(`/api/recipes/${id}`);

        if (!response.ok) throw new Error("Details failed");

        const recipe = await response.json();

        const ingredients = recipe.extendedIngredients
            .map(item => item.original)
            .join("\n");

        alert(
            recipe.title +
            "\n\nIngredients:\n" + ingredients +
            "\n\nInstructions:\n" +
            (recipe.instructions || "Not available")
        );

    } catch (error) {
        alert("Unable to load recipe details");
    }
}
