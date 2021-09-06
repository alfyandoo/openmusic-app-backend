const successResponse = (h, {
  withMessage = false,
  withData = false,
  responseMessage = '',
  responseData = {},
  responseCode = 200,
}) => {
  const response = {
    status: 'success',
  };
  if (withMessage) {
    response.message = responseMessage;
  }
  if (withData) {
    response.data = responseData;
  }
  return h.response(response).code(responseCode);
};

module.exports = { successResponse };
