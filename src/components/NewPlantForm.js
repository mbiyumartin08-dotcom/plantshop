import React, { useState } from "react";
import { API_URL } from "../api";

/**
 * Controlled form that creates a plant on the backend (POST) and then hands
 * the saved plant to the parent through onAddPlant so it appears on the page.
 */
function NewPlantForm({ onAddPlant }) {
  const [formData, setFormData] = useState({ name: "", image: "", price: "" });

  // One handler for all three inputs: the input's name attribute is the key.
  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        image: formData.image,
        price: parseFloat(formData.price),
      }),
    })
      .then((r) => r.json())
      .then((newPlant) => {
        onAddPlant(newPlant);
        setFormData({ name: "", image: "", price: "" });
      })
      .catch((error) => console.error("Could not add plant:", error));
  }

  return (
    <div className="new-plant-form">
      <h2>New Plant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Plant name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          step="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />
        <button type="submit">Add Plant</button>
      </form>
    </div>
  );
}

export default NewPlantForm;
