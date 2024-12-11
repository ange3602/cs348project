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

// Get a meal by ID
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("meals");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Meal not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Error fetching meal by ID:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Create a new meal
router.post("/", async (req, res) => {
  try {
    const newMeal = {
      name: req.body.name,
      items: req.body.items || [], // Keep items consistent
      totals: req.body.totals || {}, // Include totals as part of the structure
    };
    const mealsCollection = await db.collection("meals");
    const result = await mealsCollection.insertOne(newMeal);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating meal:", err);
    res.status(500).json({ error: "Failed to create meal" });
  }
});

//patch
router.patch("/:id", async (req, res) => {
    try {
      const mealsCollection = await db.collection("meals");
  
      // Log the request body and current document in the database
      console.log("Request Body:", req.body);
      const existingMeal = await mealsCollection.findOne({ _id: new ObjectId(req.params.id) });
      console.log("Existing Meal in DB:", existingMeal);
  
      // Prepare the update object
      const updatedMeal = {
        $set: {
          name: req.body.name,
          items: req.body.items, // Ensure this is being updated correctly
          totals: req.body.totals,
        },
      };
  
      // Perform the update
      const result = await mealsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        updatedMeal
      );
  
      // Log the update result
      console.log("MongoDB Update Result:", result);
  
      // Respond to the client
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
