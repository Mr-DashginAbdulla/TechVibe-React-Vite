import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Product", "Review", "Cart", "Wishlist"],
  endpoints: (builder) => ({
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    getAllProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),

    getRelatedProducts: builder.query({
      query: ({ category, excludeId, limit = 4 }) =>
        `/products?category=${category}&id_ne=${excludeId}&_limit=${limit}`,
      providesTags: ["Product"],
    }),

    getProductReviews: builder.query({
      query: (productId) => `/reviews?productId=${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Review", id: productId },
      ],
    }),

    getCategories: builder.query({
      query: () => "/categories",
    }),

    getCart: builder.query({
      query: (userId) => `/cart?userId=${userId}`,
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: "/cart",
        method: "POST",
        body: cartItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/cart/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation({
      async queryFn(userId, _queryApi, _extraOptions, fetchWithBQ) {
        const cartResult = await fetchWithBQ(`/cart?userId=${userId}`);
        if (cartResult.error) return { error: cartResult.error };

        const deletePromises = cartResult.data.map((item) =>
          fetchWithBQ({ url: `/cart/${item.id}`, method: "DELETE" }),
        );
        await Promise.all(deletePromises);

        return { data: { success: true } };
      },
      invalidatesTags: ["Cart"],
    }),

    getWishlist: builder.query({
      query: (userId) => `/wishlist?userId=${userId}`,
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation({
      query: (wishlistItem) => ({
        url: "/wishlist",
        method: "POST",
        body: wishlistItem,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: (id) => ({
        url: `/wishlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    checkWishlistItem: builder.query({
      query: ({ userId, productId }) =>
        `/wishlist?userId=${userId}&productId=${productId}`,
      providesTags: ["Wishlist"],
    }),

    addReview: builder.mutation({
      query: (review) => ({
        url: "/reviews",
        method: "POST",
        body: review,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Review", id: productId },
      ],
    }),

    updateReview: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["Review"],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetAllProductsQuery,
  useGetRelatedProductsQuery,
  useGetProductReviewsQuery,
  useGetCategoriesQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckWishlistItemQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = productsApi;
