import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const collection = db.collection("meals");
      const meals = await collection.find({}).toArray();
      console.log("Fetched meals:", meals); // Debug log
      res.status(200).json(meals);
    } catch (err) {
      console.error("Error fetching meals:", err);
      res.status(500).json({ error: "Failed to fetch meals" });
    }
  });
// Seed default meals
router.post("/seed", async (req, res) => {
  const defaultMeals = [
    { name: "Breakfast" },
    { name: "Lunch" },
    { name: "Dinner" },
    { name: "Snacks" },
  ];

  try {
    const collection = await db.collection("meals");
    await collection.deleteMany(); // Clear existing meals
    const result = await collection.insertMany(defaultMeals); // Insert default meals
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error seeding meals");
  }
});

// Get a single meal by id
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
    console.error(err);
    res.status(500).send("Error fetching meal");
  }
});

// Update an existing meal
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: { name: req.body.name },
    };

    const collection = await db.collection("meals");
    const result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating meal");
  }
});

// Delete a meal
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("meals");
    const result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting meal");
  }
});

export default router;
