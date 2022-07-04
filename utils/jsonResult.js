const jsonResult = function (res, data = null, msg = null) {
  return {
    res,
    data,
    msg,
  };
};

module.exports = jsonResult;
