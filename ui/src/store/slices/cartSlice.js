import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const initialState = {
  items: [],
  isLoading: false,
  userId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartUserId: (state, action) => {
      state.userId = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.getCart.matchFulfilled,
        (state, action) => {
          state.items = action.payload;
          state.isLoading = false;
        },
      )
      .addMatcher(apiSlice.endpoints.getCart.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        apiSlice.endpoints.addToCart.matchFulfilled,
        (state, action) => {
          state.items.push(action.payload);
        },
      )
      .addMatcher(
        apiSlice.endpoints.removeFromCart.matchFulfilled,
        (state, action) => {
          state.items = state.items.filter(
            (item) => item.id !== action.meta.arg.originalArgs,
          );
        },
      );
  },
});

export const { setCartUserId, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );

export default cartSlice.reducer;
