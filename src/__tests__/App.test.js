import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../components/App";

const PLANTS = [
  { id: 1, name: "Aloe", image: "./images/aloe.jpg", price: 15.99 },
  { id: 2, name: "ZZ Plant", image: "./images/zz-plant.jpg", price: 25.98 },
  { id: 3, name: "Pothos", image: "./images/pothos.jpg", price: 12.11 },
];

// Stand-in for json-server: GET returns the plants, POST echoes the new plant
// back with an id, just like the real backend does.
beforeEach(() => {
  global.fetch = jest.fn((url, options) => {
    if (options && options.method === "POST") {
      const body = JSON.parse(options.body);
      return Promise.resolve({ json: () => Promise.resolve({ id: 99, ...body }) });
    }
    return Promise.resolve({ json: () => Promise.resolve(PLANTS) });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("loading plants", () => {
  test("fetches from the backend and renders every plant on page load", async () => {
    render(<App />);

    expect(await screen.findByText("Aloe")).toBeInTheDocument();
    expect(screen.getByText("ZZ Plant")).toBeInTheDocument();
    expect(screen.getByText("Pothos")).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:6001/plants");
    expect(screen.getAllByTestId("plant-item")).toHaveLength(3);
  });
});

describe("adding a plant", () => {
  test("POSTs the form data and shows the new plant on the page", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    fireEvent.change(screen.getByPlaceholderText("Plant name"), {
      target: { value: "Fern" },
    });
    fireEvent.change(screen.getByPlaceholderText("Image URL"), {
      target: { value: "./images/fern.jpg" },
    });
    fireEvent.change(screen.getByPlaceholderText("Price"), {
      target: { value: "7.5" },
    });
    fireEvent.click(screen.getByText("Add Plant"));

    expect(await screen.findByText("Fern")).toBeInTheDocument();
    expect(screen.getAllByTestId("plant-item")).toHaveLength(4);

    const postCall = global.fetch.mock.calls.find(
      ([, options]) => options && options.method === "POST"
    );
    expect(postCall[0]).toBe("http://localhost:6001/plants");
    expect(JSON.parse(postCall[1].body)).toEqual({
      name: "Fern",
      image: "./images/fern.jpg",
      price: 7.5,
    });
  });

  test("clears the form after a successful submit", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    const nameInput = screen.getByPlaceholderText("Plant name");
    fireEvent.change(nameInput, { target: { value: "Fern" } });
    fireEvent.click(screen.getByText("Add Plant"));

    await screen.findByText("Fern");
    await waitFor(() => expect(nameInput).toHaveValue(""));
  });
});

describe("stock status", () => {
  test("a plant can be marked out of stock and back in stock", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    const buttons = screen.getAllByText("In Stock");
    expect(buttons).toHaveLength(3);

    fireEvent.click(buttons[0]);
    expect(screen.getAllByText("In Stock")).toHaveLength(2);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Out of Stock"));
    expect(screen.getAllByText("In Stock")).toHaveLength(3);
  });
});

describe("searching", () => {
  test("filters plants by name as the user types, ignoring case", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    fireEvent.change(screen.getByPlaceholderText("Type a name to search..."), {
      target: { value: "zz" },
    });

    expect(screen.getByText("ZZ Plant")).toBeInTheDocument();
    expect(screen.queryByText("Aloe")).not.toBeInTheDocument();
    expect(screen.queryByText("Pothos")).not.toBeInTheDocument();
  });

  test("shows all plants again when the search is cleared", async () => {
    render(<App />);
    await screen.findByText("Aloe");
    const search = screen.getByPlaceholderText("Type a name to search...");

    fireEvent.change(search, { target: { value: "pothos" } });
    expect(screen.getAllByTestId("plant-item")).toHaveLength(1);

    fireEvent.change(search, { target: { value: "" } });
    expect(screen.getAllByTestId("plant-item")).toHaveLength(3);
  });

  test("shows no plants when nothing matches", async () => {
    render(<App />);
    await screen.findByText("Aloe");

    fireEvent.change(screen.getByPlaceholderText("Type a name to search..."), {
      target: { value: "cactus" },
    });
    expect(screen.queryAllByTestId("plant-item")).toHaveLength(0);
  });
});
