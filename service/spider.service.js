const { default: axios } = require('axios');
const cherrio = require('cheerio');
const FormData = require('form-data');
const { movieParamMap } = require('../constants/movie');
const STATUS_CODE = require('../constants/status-code');

async function getMovieItem({ title, link }) {
  const formData = new FormData();

  formData.append('wd', title);

  const res = await axios.post('http://www.doubiekan.cc/search/', formData, {
    headers: { ...formData.getHeaders(), 'Content-Length': formData.getLengthSync() },
  });

  const $ = cherrio.load(res.data);

  if ($('.details-info-min').length === 0) {
    return {
      res: STATUS_CODE.SUCCESS,
      data: null,
    };
  }

  let index = -1;

  for (let i = 0; i <= $('.details-info-min').length; i++) {
    const url = $('.details-info-min').eq(i).find('.video-pic.loading').attr('href');

    if (url === link) {
      index = i;
      break;
    }
  }

  const li = $('.details-info-min').eq(index).find('li');
  const obj = {};

  for (let i = 0; i < li.length; i++) {
    const text = li.eq(i).text().trim();
    const records = text.split('：');
    if (text && records.length > 1) {
      const [label, value] = records;

      movieParamMap.get(label) && (obj[`${movieParamMap.get(label)}`] = value);
    }
  }

  return {
    res: 0,
    data: obj,
  };
}

/**
 * @description 电影搜索接口
 * @param {String} title 电影名称
 * @returns {Promise<{res: Number; data: Object | Array}>} 返回值
 */
async function getMovieList() {
  // const formData = new FormData();

  // formData.append('wd', title);

  // const res = await axios.post('http://www.doubiekan.cc/search/', formData, {
  //   headers: { ...formData.getHeaders(), 'Content-Length': formData.getLengthSync() },
  // });

  // const $ = cherrio.load(res.data);

  // if ($('.details-info-min').length === 0) {
  //   return {
  //     res: STATUS_CODE.SUCCESS,
  //     data: null,
  //   };
  // }

  const records = [];

  // list.forEach((item) => {
  //   let index = -1;

  //   for (let i = 0; i <= $('.details-info-min').length; i++) {
  //     const url = $('.details-info-min').eq(i).find('.video-pic.loading').attr('href');

  //     if (url === link) {
  //       index = i;
  //       break;
  //     }
  //   }

  //   const li = $('.details-info-min').eq(index).find('li');
  //   const obj = {};

  //   for (let i = 0; i < li.length; i++) {
  //     const text = li.eq(i).text().trim();
  //     const records = text.split('：');
  //     if (text && records.length > 1) {
  //       const [label, value] = records;

  //       movieParamMap.get(label) && (obj[`${movieParamMap.get(label)}`] = value);
  //     }
  //   }

  //   records.push(obj);
  // });

  return {
    res: STATUS_CODE.SUCCESS,
    data: records,
  };
}

module.exports = {
  getMovieItem,
  getMovieList,
};
