import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FoodItem = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle">{props.food.name}</td>
    <td className="p-4 align-middle">{props.food.calories}</td>
    <td className="p-4 align-middle">{props.food.protein}</td>
    <td className="p-4 align-middle">{props.food.carbs}</td>
    <td className="p-4 align-middle">{props.food.fat}</td>
    <td className="p-4 align-middle">{props.food.serving_size}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        {/* Edit Button */}
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.food._id}`}
        >
          Edit
        </Link>

        {/* Delete Button */}
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          type="button"
          onClick={() => props.deleteFood(props.food._id)}
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
      const response = await fetch(`http://localhost:5050/record/`); // Replace with your API endpoint
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const foodItems = await response.json();
      setFoods(foodItems);
    }
    fetchFoods();
  }, [foods.length]);

  // Delete a food item by ID
  async function deleteFood(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const updatedFoods = foods.filter((food) => food._id !== id);
    setFoods(updatedFoods);
  }

  // Map food items to table rows
  function foodItemList() {
    return foods.map((food) => (
      <FoodItem
        food={food}
        deleteFood={() => deleteFood(food._id)}
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
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
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
