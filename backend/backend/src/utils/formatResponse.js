export const formatSuccess = (data) => {
  return {
    success: true,
    data: data || {}
  };
};

export const formatError = (message) => {
  return {
    success: false,
    message: message || 'Something went wrong'
  };
};
