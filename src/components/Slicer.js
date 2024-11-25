import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "animalStatus",
  initialState: {
    favoriteIds: [],
    likeDislikeStatus: {},
    ratings: {},
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
      } else {
        state.favoriteIds.push(id);
      }
    },
    setLikeDislike: (state, action) => {
      const { animalId, characteristic, status } = action.payload;
      if (!state.likeDislikeStatus[animalId]) {
        state.likeDislikeStatus[animalId] = {};
      }
      state.likeDislikeStatus[animalId][characteristic] = status;
    },
    resetLikeDislike: (state, action) => {
      const { animalId } = action.payload;
      if (state.likeDislikeStatus[animalId]) {
        Object.keys(state.likeDislikeStatus[animalId]).forEach(
          (key) => (state.likeDislikeStatus[animalId][key] = "none")
        );
      }
    },
    setRating: (state, action) => {
      const { animalId, rating } = action.payload;
      state.ratings[animalId] = rating;
    },
  },
});

export const { toggleFavorite, setLikeDislike, resetLikeDislike, setRating } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
