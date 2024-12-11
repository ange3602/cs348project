import React, { useState, useEffect } from "react";

function HomePage() {
  const [meals, setMeals] = useState([]);

  // Fetch meals from the backend
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/meals"); // Replace with your backend URL
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Meal Tracker</h1>
      <h2 className="text-xl mb-2">Meal Collections:</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Meal</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{meal.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomePage;
