import { createSlice } from "@reduxjs/toolkit";
import { productsApi } from "../api/productsApi";

const initialState = {
  items: [],
  isLoading: false,
  userId: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistUserId: (state, action) => {
      state.userId = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        productsApi.endpoints.getWishlist.matchFulfilled,
        (state, action) => {
          state.items = action.payload;
          state.isLoading = false;
        },
      )
      .addMatcher(productsApi.endpoints.getWishlist.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        productsApi.endpoints.addToWishlist.matchFulfilled,
        (state, action) => {
          state.items.push(action.payload);
        },
      )
      .addMatcher(
        productsApi.endpoints.removeFromWishlist.matchFulfilled,
        (state, action) => {
          state.items = state.items.filter(
            (item) => item.id !== action.meta.arg.originalArgs,
          );
        },
      );
  },
});

export const { setWishlistUserId, clearWishlist } = wishlistSlice.actions;
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistItemCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => item.productId === productId);

export default wishlistSlice.reducer;
