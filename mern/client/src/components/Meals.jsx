import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Meal = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50">
    <td className="p-4 align-middle">{props.meal.name}</td>
    <td className="p-4 align-middle">      {props.meal.foodItems ? props.meal.foodItems.length : 0} items
    </td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit-meal/${props.meal._id}`}
        >
          Edit
        </Link>
        {/* <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          type="button"
          onClick={() => props.deleteMeal(props.meal._id)}
        >
          Delete
        </button> */}
      </div>
    </td>
  </tr>
);

export default function MealsList() {
  const [meals, setMeals] = useState([]);

  // Fetch all meals from the database
  useEffect(() => {
    async function fetchMeals() {
      const response = await fetch(`http://localhost:5050/meal`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const mealData = await response.json();
      setMeals(mealData);
    }
    fetchMeals();
  }, []);

  // Delete a meal by ID
  async function deleteMeal(id) {
    await fetch(`http://localhost:5050/meal/${id}`, {
      method: "DELETE",
    });
    const updatedMeals = meals.filter((meal) => meal._id !== id);
    setMeals(updatedMeals);
  }

  // Map meals to table rows
  function mealList() {
    return meals.map((meal) => (
      <Meal
        meal={meal}
        deleteMeal={() => deleteMeal(meal._id)}
        key={meal._id}
      />
    ));
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Meals</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                  Meal Name
                </th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                  Number of Food Items
                </th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>{mealList()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
