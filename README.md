# Plantsy

A React admin page for a plant store. It connects to a `json-server` backend so plants load from, and are saved to, an API.

## Features

- **See all plants** – plants are fetched from the backend with `useEffect` when the page loads.
- **Add a plant** – the form sends a `POST` request, then the saved plant appears on the page.
- **Mark as sold out** – each card's stock button toggles between "In Stock" and "Out of Stock". This is not saved to the backend, so a refresh resets it.
- **Search** – type to filter plants by name (case-insensitive). Clearing the box shows every plant again.

## Screenshot

Run the app, take a screenshot of the finished page, save it as `screenshots/plantsy.png`, then uncomment the line below.

<!-- ![Plantsy](screenshots/plantsy.png) -->

## Installation

Requires Node.js 18+.

```bash
npm install
```

## Usage

Run the backend and the frontend in two terminals:

```bash
npm run server   # json-server on http://localhost:6001 (check /plants in your browser)
npm run dev      # React app on http://localhost:3000 (npm start does the same)
```

Run the tests (the backend does not need to be running; `fetch` is mocked):

```bash
npm test
```

## Project structure

```
src/
├── api.js                    backend URL
└── components/
    ├── App.js
    ├── Header.js
    └── PlantPage.js          state: plants, searchTerm; fetches plants
        ├── NewPlantForm.js   props: onAddPlant; POSTs a new plant
        ├── Search.js         props: searchTerm, onSearchChange
        └── PlantList.js      props: plants
            └── PlantCard.js  props: plant; state: inStock
```

State lives in `PlantPage` because the form, search box and list all depend on it. The list of visible plants is calculated from `plants` and `searchTerm` on each render rather than stored separately.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/plants` | load all plants |
| POST | `/plants` | create a plant (`name`, `image`, `price`) |

## Known limitations

- Stock status is not persisted.
- The sample images in `db.json` point to `./images/...`, but `public/images` is empty in this repo, so those images show as broken until image files are added.
- New plants are not validated (an empty name or price can be submitted).
