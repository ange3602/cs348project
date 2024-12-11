import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all meals
router.get("/", async (req, res) => {
  try {
    const mealsCollection = await db.collection("meals");
    const meals = await mealsCollection.find({}).toArray();
    res.status(200).json(meals);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

// Get a single meal by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const mealsCollection = await db.collection("meals");

    // Query handles both ObjectId and string _id
    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id) }
      : { _id: id };

    const meal = await mealsCollection.findOne(query);

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    res.status(200).json(meal);
  } catch (err) {
    console.error("Error fetching meal:", err);
    res.status(500).json({ error: "Failed to fetch meal" });
  }
});

// Create a new meal
router.post("/", async (req, res) => {
  try {
    const newMeal = {
      name: req.body.name,
      foodItems: req.body.foodItems || [],
    };
    const mealsCollection = await db.collection("meals");
    const result = await mealsCollection.insertOne(newMeal);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating meal:", err);
    res.status(500).json({ error: "Failed to create meal" });
  }
});

// Update a meal by ID
router.patch("/:id", async (req, res) => {
  try {
    const updatedMeal = {
      $set: {
        name: req.body.name,
        foodItems: req.body.foodItems,
      },
    };
    const mealsCollection = await db.collection("meals");
    const result = await mealsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      updatedMeal
    );
    res.status(200).json(result);
  } catch (err) {
    console.error("Error updating meal:", err);
    res.status(500).json({ error: "Failed to update meal" });
  }
});

// Delete a meal by ID
router.delete("/:id", async (req, res) => {
  try {
    const mealsCollection = await db.collection("meals");
    const result = await mealsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error deleting meal:", err);
    res.status(500).json({ error: "Failed to delete meal" });
  }
});

export default router;
