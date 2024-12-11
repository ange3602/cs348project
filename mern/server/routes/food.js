import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all food items
router.get("/", async (req, res) => {
  let collection = await db.collection("food");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// Get a single food item by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("food");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.status(404).send("Not found");
  else res.status(200).send(result);
});

// Add a new food item
router.post("/", async (req, res) => {
  try {
    let newFood = {
      name: req.body.name,
      calories: req.body.calories,
      protein: req.body.protein,
      carbs: req.body.carbs,
      fat: req.body.fat,
      serving_size: req.body.serving_size,
    };
    let collection = await db.collection("food");
    let result = await collection.insertOne(newFood);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding food");
  }
});

// Update an existing food item
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        calories: req.body.calories,
        protein: req.body.protein,
        carbs: req.body.carbs,
        fat: req.body.fat,
        serving_size: req.body.serving_size,
      },
    };

    let collection = await db.collection("food");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating food");
  }
});

// Delete a food item
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    let collection = db.collection("food");
    let result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting food");
  }
});

export default router;
