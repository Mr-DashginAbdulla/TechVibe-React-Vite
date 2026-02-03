import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Product", "Review", "Cart", "Wishlist"],
  endpoints: (builder) => ({
    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Get all products
    getAllProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),

    // Get products by category (for related products)
    getRelatedProducts: builder.query({
      query: ({ category, excludeId, limit = 4 }) =>
        `/products?category=${category}&id_ne=${excludeId}&_limit=${limit}`,
      providesTags: ["Product"],
    }),

    // Get reviews for a product
    getProductReviews: builder.query({
      query: (productId) => `/reviews?productId=${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Review", id: productId },
      ],
    }),

    // Get all categories
    getCategories: builder.query({
      query: () => "/categories",
    }),

    // Cart operations
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
        // First get all cart items for this user
        const cartResult = await fetchWithBQ(`/cart?userId=${userId}`);
        if (cartResult.error) return { error: cartResult.error };

        // Delete each cart item
        const deletePromises = cartResult.data.map((item) =>
          fetchWithBQ({ url: `/cart/${item.id}`, method: "DELETE" }),
        );
        await Promise.all(deletePromises);

        return { data: { success: true } };
      },
      invalidatesTags: ["Cart"],
    }),

    // Wishlist operations
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

    // Check if product is in wishlist
    checkWishlistItem: builder.query({
      query: ({ userId, productId }) =>
        `/wishlist?userId=${userId}&productId=${productId}`,
      providesTags: ["Wishlist"],
    }),

    // Review operations
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
} = productsApi;
