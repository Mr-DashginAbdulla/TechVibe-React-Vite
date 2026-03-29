/**
 * Reusable pagination helper for Mongoose queries.
 */

/**
 * Applies pagination to a Mongoose query.
 * @param {Object} queryParams - req.query object (_page, _limit)
 * @returns {{ page: number, limit: number, skip: number }}
 */
const getPaginationParams = (queryParams) => {
  const page = Math.max(1, parseInt(queryParams._page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(queryParams._limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Wraps a paginated response with metadata.
 * @param {Array} data - Results array
 * @param {number} total - Total document count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 */
const paginatedResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  },
});

module.exports = { getPaginationParams, paginatedResponse };
