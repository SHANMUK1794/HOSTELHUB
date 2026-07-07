export const handleError = (res, error) => {
  console.error(error);

  const message = error.message || "Internal Server Error";

  let status = 500;

  if (
    message.includes("already") ||
    message.includes("valid") ||
    message.includes("required") ||
    message.includes("future") ||
    message.includes("Room") ||
    message.includes("occupied") ||
    message.includes("must") ||
    message.includes("date") ||
    message.includes("digits") ||
    message.includes("Aadhaar") ||
    message.includes("check")
  ) {
    status = 400;
  } else if (
    message.includes("not found") ||
    message.includes("Not Found")
  ) {
    status = 404;
  } else if (error.statusCode) {
    status = error.statusCode;
  }

  return res.status(status).json({
    success: false,
    message,
  });
};