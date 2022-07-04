const { default: axios } = require('axios');
const cherrio = require('cheerio');
const db = require('../utils/db');
const STATUS_CODE = require('../constants/status-code');

// const { getMovieItem } = require('./spider.service');

// const addMovie = ({
//   movieName = null,
//   poster = null,
//   actorList = null,
//   director = null,
//   createAt = null,
//   location = 0,
//   movieType = 0,
//   movieIntro = null,
//   movieUrl = null,
//   pid = null,
//   score = 0,
// }) => {
//   const sql = `
//   INSERT INTO movie
//   (movie_name, poster, actor_list, director, create_at, location, movie_type, movie_intro, movie_url, pid, score)
//   VALUES
//   ('${movieName}', '${poster}', '${actorList}', '${director}', '${createAt}', '${location}', ${movieType}, '${movieIntro}', '${movieUrl}', ${pid}, ${score})
// `;
//   console.log(sql);

//   return db.query(sql);
// };

// const getMovieList = ({
//   pageNum = 1,
//   pageSize = 10,
//   keyword = '',
//   type = 0,
//   location = 0,
//   score = 0,
// }) => {
//   let sql = `
//     SELECT * FROM movie
//     WHERE 1=1
//   `;

//   if (keyword) {
//     sql += `
//       AND movie_name LIKE "%${keyword}%"
//     `;
//   }

//   if (type) {
//     sql += `
//       AND movie_type = ${type}
//     `;
//   }

//   if (location) {
//     sql += `
//       AND location = ${location}
//     `;
//   }
//   if (score) {
//     sql += `
//       AND score = ${score}
//     `;
//   }

//   sql += `
//     ORDER BY create_at DESC
//     LIMIT ${(pageNum - 1) * pageSize}, ${pageSize}
//   `;

//   return db.query(sql);
// };

const getMovieListByBTNULL = async () => {
  const res = await axios.get('http://www.doubiekan.cc/top.html'); // /
  const $ = cherrio.load(res.data);
  const el = $('.box-video-text-list').eq(0).find('.list.p-0');

  const links = [];

  // for (let i = 0; i < el.length; i++) {
  //   try {
  //     const { data: movie } = await getMovieItem({
  //       link: el.eq(i).find('a').attr('href'),
  //       title: el.eq(i).find('a').attr('title'),
  //     });
  //     addMovie({
  //       movieName: el.eq(i).find('a').attr('title'),
  //       poster: el.eq(i).find('a').css('backgroundImage'),
  //       ...movie,
  //     });
  //     links.push({
  //       movieName: el.eq(i).find('a').attr('title'),
  //       poster: el.eq(i).find('a').css('backgroundImage'),
  //       ...movie,
  //     });
  //   } catch (error) {
  //     continue;
  //   }
  // }

  setTimeout(() => {
    console.log(el.eq(0).find('a').css('background-image'));
  }, 2000);

  return {
    code: 0,
    data: links,
  };
};

async function addMovie({
  movieName,
  poster = '',
  actorList,
  director,
  area,
  movieType,
  movieIntro,
  movieUrl,
  score,
  updateAt,
  count,
  language,
  year,
  status = '',
}) {
  const sql = `
    INSERT INTO movie (
      movie_name, poster, actor_list, director,area, movie_type, movie_intro, movie_url,score, update_at, count, language, year, status
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`;

  try {
    const res = await db.query(sql, [
      movieName,
      poster,
      actorList,
      director,
      area,
      movieType,
      movieIntro,
      movieUrl,
      score,
      updateAt,
      count,
      language,
      year,
      status,
    ]);
    console.log(res);
  } catch ({ res = STATUS_CODE.UNKNOWN_ERR, msg = '系统异常' }) {
    console.log({ res, msg });
    return {
      res,
      msg,
    };
  }
}

module.exports = {
  addMovie,
  // getMovieList,
  getMovieListByBTNULL,
};
