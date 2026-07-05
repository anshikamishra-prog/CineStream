/**
 * Wraps an async Express route handler and forwards any rejected
 * promises to the next() error middleware.
 *
 * Eliminates the need for try/catch blocks in every controller.
 *
 * Usage:
 *   router.get('/route', asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
