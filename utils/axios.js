const { default: axios } = require('axios');

module.exports = {
  request({ url = '', method = 'get', data = {}, params = {} }) {
    return axios({ url, method, data, params })
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          return {
            res: res.status,
            message: res.statusText,
          };
        }
      })
      .catch((err) => {
        return err;
      });
  },
};
