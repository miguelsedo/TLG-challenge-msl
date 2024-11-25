import { configureStore } from "@reduxjs/toolkit";
import { favoritesReducer } from "./Slicer";

const store = configureStore({
  reducer: {
    animalStatus: favoritesReducer,
  },
});

export default store;
