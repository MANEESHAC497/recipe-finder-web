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
           `/api/recipes?query=${encodeURIComponent(query)}&type=${encodeURIComponent(document.getElementById("mealFilter").value)}`
       
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

        if (!response.ok) {
            throw new Error("Details failed");
        }

        const recipe = await response.json();

        const overlay = document.createElement("div");

        overlay.style.cssText = `
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.7);
            display:flex;
            justify-content:center;
            align-items:center;
            padding:15px;
            z-index:9999;
        `;

        const modal = document.createElement("div");

        modal.style.cssText = `
            background:white;
            color:#333;
            padding:20px;
            border-radius:15px;
            max-width:600px;
            width:100%;
            max-height:85vh;
            overflow-y:auto;
        `;

        const title = document.createElement("h2");
        title.textContent = recipe.title;

        const image = document.createElement("img");
        image.src = recipe.image;
        image.alt = recipe.title;
        image.style.cssText =
            "width:100%;border-radius:10px;margin:12px 0;";

        const heading1 = document.createElement("h3");
        heading1.textContent = "Ingredients";

        const ingredients = document.createElement("ul");

        recipe.extendedIngredients.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.original;
            ingredients.appendChild(li);
        });

        const heading2 = document.createElement("h3");
        heading2.textContent = "Instructions";

        const instructions = document.createElement("p");
        const temp = document.createElement("div");
        temp.innerHTML = recipe.instructions || "";
        instructions.textContent =
            temp.textContent.trim() || "Not available";

        const close = document.createElement("button");
        close.textContent = "Close";
        close.style.cssText =
            "background:#ff5722;color:white;padding:12px 25px;border:0;border-radius:8px;margin-top:15px;";

        close.onclick = () => overlay.remove();

        modal.append(
            title, image, heading1, ingredients,
            heading2, instructions, close
        );

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

    } catch (error) {
        alert("Unable to load recipe details");
    }
}

