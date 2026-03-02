import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

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
        apiSlice.endpoints.getWishlist.matchFulfilled,
        (state, action) => {
          state.items = action.payload;
          state.isLoading = false;
        },
      )
      .addMatcher(apiSlice.endpoints.getWishlist.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        apiSlice.endpoints.addToWishlist.matchFulfilled,
        (state, action) => {
          state.items.push(action.payload);
        },
      )
      .addMatcher(
        apiSlice.endpoints.removeFromWishlist.matchFulfilled,
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
