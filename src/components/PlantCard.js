import React, { useState } from "react";

function PlantCard({ plant }) {
  // Stock status is local to each card and intentionally not persisted:
  // refreshing the page resets every plant to "In Stock".
  const [inStock, setInStock] = useState(true);

  return (
    <li className="card" data-testid="plant-item">
      <img src={plant.image} alt={plant.name} />
      <h4>{plant.name}</h4>
      <p>Price: {plant.price}</p>
      {inStock ? (
        <button className="primary" onClick={() => setInStock(false)}>
          In Stock
        </button>
      ) : (
        <button onClick={() => setInStock(true)}>Out of Stock</button>
      )}
    </li>
  );
}

export default PlantCard;
