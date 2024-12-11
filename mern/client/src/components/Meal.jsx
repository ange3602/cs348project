import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MealForm() {
  const [form, setForm] = useState({
    name: "",
    items: [],
    totals: {},
  });
  const [foodOptions, setFoodOptions] = useState([]); // Dropdown food options
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  // Fetch all food options from the "food" collection
  useEffect(() => {
    async function fetchFoodOptions() {
      const response = await fetch("http://localhost:5050/record");
      if (!response.ok) {
        console.error("Failed to fetch food options:", response.statusText);
        return;
      }
      const foods = await response.json();
      setFoodOptions(foods);
    }

    fetchFoodOptions();
  }, []);

  // Fetch meal data if editing
  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/meal/${params.id.toString()}`
      );
      if (!response.ok) {
        console.error("Failed to fetch meal:", response.statusText);
        return;
      }
      const meal = await response.json();
      if (!meal) {
        console.warn(`Meal with id ${id} not found`);
        navigate("/meals");
        return;
      }
      setForm({
        name: meal.name || "",
        items: meal.items || [],
        totals: meal.totals || {},
      });
    }

    fetchData();
  }, [params.id, navigate]);

//   function updateForm(value) {
//     setForm((prev) => {
//       const updatedForm = { ...prev, ...value };
//       console.log("eee Updated form state:", updatedForm); // Debugging
//       return updatedForm;
//     });

//   }

  function updateForm(value) {
    return setForm((prev) => {
      // console.log("EEE");
      console.log("PREV", prev);
      return { ...prev, ...value };
    });
  }
  
  async function onSubmit(e) {
    e.preventDefault();
    const meal = { ...form };
  
    try {
      let response;
      if (isNew) {
        // If adding a new meal, send a POST request
        response = await fetch("http://localhost:5050/meal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(meal),
        });
      } else {
        // If updating an existing meal, send a PATCH request
        response = await fetch(`http://localhost:5050/meal/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(meal),
        });
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      await response.json();
    } catch (error) {
      console.error("A problem occurred adding or updating a meal: ", error);
    } finally {
      console.log("EEE");
      setForm({
        name: "",
        items: [],
        totals: {},
      });
      navigate("/meals");
    }
  }
  
  function addFoodItem(foodId) {
    console.log("Selected foodId:", foodId);
    if (foodId && !form.items.includes(foodId)) {
      const selectedFood = foodOptions.find((food) => food._id === foodId);
      if (selectedFood) {
        const updatedItems = [...form.items, selectedFood._id];
        updateForm({ items: updatedItems });
      }
    }
  }

  function removeItem(index) {
    const updatedItems = form.items.filter((_, i) => i !== index);
    updateForm({ items: updatedItems });
  }

  function onCancel() {
    navigate("/meals");
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Meal</h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Meal Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add the details of the meal here.
            </p>
          </div>
  
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div>
              <label htmlFor="items" className="block text-sm font-medium">
                Food Items
              </label>
              <select
                id="items"
                onChange={(e) => {
                  addFoodItem(e.target.value);
                  e.target.value = ""; // Reset dropdown after selection
                }}
                className="mt-2 block w-full border px-3 py-2 rounded"
              >
                <option value="">Select Food Item</option>
                {foodOptions.map((food) => (
                  <option key={food._id} value={food._id}>
                    {food.name}
                  </option>
                ))}
              </select>
              <ul className="list-disc pl-5 mt-4">
                {form.items.map((itemId, index) => {
                  const food = foodOptions.find((f) => f._id === itemId);
                  return (
                    <li key={index}>
                      {food ? food.name : "Unknown"}{" "}
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="submit"
            value="Save Meal"
            className="inline-flex items-center mr-2 justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer"
          />
          <input
            type="button"
            value="Cancel"
            onClick={onCancel}
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer"
          />
        </div>
      </form>
    </>
  );

}