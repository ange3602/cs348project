import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Food() {
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    serving_size: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/food/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const food = await response.json();
      if (!food) {
        console.warn(`Food item with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(food);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const foodItem = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/food", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(foodItem),
        });
      } else {
        response = await fetch(`http://localhost:5050/food/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(foodItem),
        });
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred adding or updating a food item: ", error);
    } finally {
      setForm({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        serving_size: "",
      });
      navigate("/food-list");
    }
  }

  function onCancel() {
    navigate("/food-list");
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Add/Update Food Item</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Food Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add the food item details here.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                placeholder="Food name"
                className="mt-2 block w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="calories" className="block text-sm font-medium">
                Calories
              </label>
              <input
                type="number"
                id="calories"
                value={form.calories}
                onChange={(e) => updateForm({ calories: e.target.value })}
                placeholder="Calories"
                className="mt-2 block w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="protein" className="block text-sm font-medium">
                Protein (g)
              </label>
              <input
                type="number"
                id="protein"
                value={form.protein}
                onChange={(e) => updateForm({ protein: e.target.value })}
                placeholder="Protein"
                className="mt-2 block w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="carbs" className="block text-sm font-medium">
                Carbs (g)
              </label>
              <input
                type="number"
                id="carbs"
                value={form.carbs}
                onChange={(e) => updateForm({ carbs: e.target.value })}
                placeholder="Carbs"
                className="mt-2 block w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="fat" className="block text-sm font-medium">
                Fat (g)
              </label>
              <input
                type="number"
                id="fat"
                value={form.fat}
                onChange={(e) => updateForm({ fat: e.target.value })}
                placeholder="Fat"
                className="mt-2 block w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label htmlFor="serving_size" className="block text-sm font-medium">
                Serving Size
              </label>
              <input
                type="text"
                id="serving_size"
                value={form.serving_size}
                onChange={(e) => updateForm({ serving_size: e.target.value })}
                placeholder="e.g., 1 cup, 1 large egg"
                className="mt-2 block w-full border px-3 py-2 rounded"
              />
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Food Item"
          className="inline-flex items-center justify-center whitespace-nowrap text-md mr-2 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
        <input
          type="button"
          value="Cancel"
          onClick={onCancel}
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
