const catchAsync = (fn) => (req, res, next) =>
  fn(req, res, next).catch((error) =>{console.log(error); return res.status(500).json(error)});

export default catchAsync;
