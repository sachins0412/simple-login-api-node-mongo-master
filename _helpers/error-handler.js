module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "ValidationError") {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Invalid Token" });
  }
  //user role not 'auditor' when calling /audit
  if (err.name === "Unauthorized") {
    return res
      .status(401)
      .json("Your role is not authorized for this operation");
  }
  // default to 500 server error
  return res.status(500).json({ message: err.message });
}
