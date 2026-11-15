import React, { useEffect, useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";
import { API_URL } from "../api";

/**
 * PlantPage owns the data the page depends on:
 *   plants      - every plant returned by the backend
 *   searchTerm  - what the user has typed into the search box
 * It is the nearest common parent of the form (adds plants), the search box
 * (sets the term) and the list (reads both), so the state lives here.
 */
function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all plants once, when the page first loads (empty dependency array).
  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => setPlants(data))
      .catch((error) => console.error("Could not load plants:", error));
  }, []);

  // Called by NewPlantForm with the plant the backend just created
  // (it includes the id json-server assigned).
  function handleAddPlant(newPlant) {
    setPlants((currentPlants) => [...currentPlants, newPlant]);
  }

  // Derived value, not state: recomputed each render from plants + searchTerm.
  // An empty search term matches every name, so clearing the box shows all plants.
  const visiblePlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <PlantList plants={visiblePlants} />
    </main>
  );
}

export default PlantPage;
