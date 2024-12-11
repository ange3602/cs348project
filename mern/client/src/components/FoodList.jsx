import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FoodItem = ({ food, deleteFood }) => (
  <tr className="border-b transition-colors hover:bg-muted/50">
    <td className="p-4 align-middle">{food.name}</td>
    <td className="p-4 align-middle">{food.calories}</td>
    <td className="p-4 align-middle">{food.protein}</td>
    <td className="p-4 align-middle">{food.carbs}</td>
    <td className="p-4 align-middle">{food.fat}</td>
    <td className="p-4 align-middle">{food.serving_size}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        {/* Fixed Edit Link */}
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${food._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          type="button"
          onClick={() => deleteFood(food._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function FoodList() {
  const [foods, setFoods] = useState([]);

  // Fetch all food items from the database
  useEffect(() => {
    async function fetchFoods() {
      try {
        const response = await fetch(`http://localhost:5050/food/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const foodItems = await response.json();
        setFoods(foodItems);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    }
    fetchFoods();
  }, []);

  // Delete a food item by ID
  async function deleteFood(id) {
    try {
      const response = await fetch(`http://localhost:5050/food/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedFoods = foods.filter((food) => food._id !== id);
      setFoods(updatedFoods);
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  }

  // Map food items to table rows
  function foodItemList() {
    return foods.map((food) => (
      <FoodItem
        food={food}
        deleteFood={deleteFood}
        key={food._id}
      />
    ));
  }

  // Render the food items table
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Food Items</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left font-medium">Name</th>
                <th className="h-12 px-4 text-left font-medium">Calories</th>
                <th className="h-12 px-4 text-left font-medium">Protein (g)</th>
                <th className="h-12 px-4 text-left font-medium">Carbs (g)</th>
                <th className="h-12 px-4 text-left font-medium">Fat (g)</th>
                <th className="h-12 px-4 text-left font-medium">Serving Size</th>
                <th className="h-12 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>{foodItemList()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
