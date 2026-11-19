const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(__dirname));
app.use(express.json());

app.get("/api/recipes", async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({
                message: "Recipe name is required"
            });
        }

        const url = new URL(
            "https://api.spoonacular.com/recipes/complexSearch"
        );

        url.searchParams.set("query", query);
        url.searchParams.set("number", "12");
        const cuisine = req.query.cuisine;
        if (cuisine) {
          url.searchParams.set("cuisine", cuisine);
               }
        const diet = req.query.diet;
            if (diet) {
    url.searchParams.set("diet", diet);
         }

     const mealType = req.query.type;

       if (mealType === "Breakfast") {
        url.searchParams.set("type", "breakfast");
            } else if (mealType === "Lunch" || mealType === "Dinner") {
              url.searchParams.set("type", "main course");
              }
             url.searchParams.set(
            "apiKey",
            process.env.SPOONACULAR_API_KEY
        );

        const response = await fetch(url);
        const data = await response.json();

        res.status(response.status).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

app.get("/api/recipes/:id", async (req, res) => {
    try {
        const url = new URL(
            `https://api.spoonacular.com/recipes/${req.params.id}/information`
        );

        url.searchParams.set(
            "apiKey",
            process.env.SPOONACULAR_API_KEY
        );

        const response = await fetch(url);
        const data = await response.json();

        res.status(response.status).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Unable to load recipe"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Recipe Finder Server Running");
});

