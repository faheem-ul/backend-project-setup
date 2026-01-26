// const asyncHandler = (fn) => {
//  return async (req, res, next) => {
//     try {
//       await fn(req, res, next);
//     } catch (error) {
//       res
//         .status(error.code || 500)
//         .json({ success: false, message: error.message });
//     }
//   };
// };

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// console.log(asyncHandler());

export { asyncHandler };
