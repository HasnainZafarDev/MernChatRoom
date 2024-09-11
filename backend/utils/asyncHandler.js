const asyncHandler = (fn) => async (req, res, next) => {
    return Promise.resolve(fn(req,res,next)).catch((err)=> next(err))
};
module.exports ={ asyncHandler };


// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// export { asyncHandler };