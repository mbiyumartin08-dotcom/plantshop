import React from "react";
import PlantCard from "./PlantCard";

// Renders one PlantCard per plant it receives. Filtering has already been
// done by PlantPage, so this component only displays.
function PlantList({ plants }) {
  return (
    <ul className="cards">
      {plants.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </ul>
  );
}

export default PlantList;
