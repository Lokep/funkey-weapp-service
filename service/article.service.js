const { default: axios } = require('axios');
const cheerio = require('cheerio');
const dayjs = require('dayjs');
const STATUS_CODE = require('../constants/status-code');
const db = require('../utils/db');

/**
 *
 * @param {String} title            标题
 * @param {Number} origin           文章来源 0-全部 1-wechat 2-juejin 3-zhihu 100-其他
 * @param {String} author           作者
 * @param {Datetime} createAt       创建时间
 * @param {Number} star             是否为星标文章 0-非星标 1-星标
 * @param {String} tag              文章标签
 * @param {String} timeStart        过滤创建时间
 * @param {String} timeEnd          过滤创建时间
 * @returns
 */
async function getArticleList({
  title,
  origin,
  author,
  createAt = '',
  star = 0, // 默认为非星标
  tag = '',

  timeStart = '',
  timeEnd = '',
}) {
  const sql = ['select * from article where is_delete = 0 '];

  if (title) sql.push(`title='${title}'`);
  if (origin) sql.push(`origin=${origin}`);
  if (author) sql.push(`author='${author}'`);
  if (tag) sql.push(`tag='${tag}'`);
  if (star) sql.push(`star='${star}'`);

  if (createAt) sql.push(`createAt='${createAt}'`);

  if (timeStart) sql.push(`createAt > '${timeStart}'`);
  if (timeEnd) sql.push(`createAt < '${timeEnd}'`);

  try {
    const list = await db.query(sql.join(' and '));
    return {
      res: STATUS_CODE.SUCCESS,
      data: list,
    };
  } catch ({ res = STATUS_CODE.UNKNOWN_ERR, msg = '系统异常' }) {
    return {
      res,
      msg,
    };
  }
}

/**
 *
 * @param {String} aid            原文id
 * @param {String} title          标题
 * @param {Number} origin         文章来源 0-全部 1-wechat 2-juejin 3-zhihu 100-其他
 * @param {String} originLink     原文链接
 * @param {String} author         作者
 * @param {String} authorAvatar   作者头像
 * @param {String} updateAt       文章发布/更新时间
 * @param {String} tag            文章类型、主题，例如webpack、vite
 * @param {String} content        文章内容
 * @param {String} banner         文章顶部图片
 * @returns
 */
async function addArticle({
  aid,
  title,
  originLink,
  origin = 100,
  author,
  authorAvatar,
  updateAt,
  tag,
  content,
  banner,
  createAt = dayjs().format('YYYY-MM-DD hh:mm:ss'),
}) {
  const sql = `INSERT INTO article (aid, title, origin_link, origin, author, author_avatar, update_at, tag, content, banner, create_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  try {
    const res = await db.query(
      sql,
      [
        aid,
        title,
        originLink,
        origin,
        author,
        authorAvatar,
        updateAt,
        tag,
        content,
        banner,
        createAt,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return err;
        } else {
          return result;
        }
      },
    );

    return {
      res: STATUS_CODE.SUCCESS,
      data: res,
    };
  } catch ({ res = STATUS_CODE.UNKNOWN_ERR, msg = '系统异常' }) {
    return {
      res,
      msg,
    };
  }
}

// async function updateArticle() {}

// async function deleteArticleById() {}

/**
 * 设置为星标文章
 * @param {String} id 文章id
 * @param {Number} star 是否为星标 0-非星标， 1-星标
 */
// async function setStar({ id, star }) {}

/**
 *
 * @param {String} link
 * @return {Number} origin     文章来源 0-全部 1-wechat 2-juejin 3-zhihu 100-其他
 */
async function articleResolver(link) {
  let result = {
    res: STATUS_CODE.COMMON_ERR,
    data: {},
  };
  let origin = 100;

  if (!link) {
    return {
      res: STATUS_CODE.COMMON_ERR,
      data: {},
      msg: '',
    };
  }

  const aid = link.split('/').pop();

  if (link.indexOf('weixin') > -1) {
    origin = 1;
    result = await wechatArticleResolver(link);
  }

  if (link.indexOf('juejin') > -1) {
    origin = 2;
    result = await juejinArticleResolver(link);
  }

  if (link.indexOf('zhihu') > -1) {
    origin = 3;
    result = await zhihuArticleResolver(link);
  }

  result.data = {
    ...result.data,
    aid,
    origin,
  };

  return { ...result };
}

/**
 * 微信公众号文章解析器
 * @param {String} link
 * @returns
 */
async function wechatArticleResolver(link) {
  const res = await axios({ url: link });
  const $ = cheerio.load(res.data);

  const author = $('meta[name="author"]').attr('content');
  const banner = $('meta[property="og:image"]').attr('content');
  const title = $('meta[property="og:title"]').attr('content');
  const authorAvatar = $('.avatar').attr('src');

  const startText = 'i&&(i.innerText=r)};if(!window.__second_open__){e(';
  const endText = ',document.getElementById("publish_time")';

  const startIndex = res.data.indexOf(startText) + startText.length;
  const endIndex = res.data.indexOf(endText); // - endText.length;

  const list = res.data.slice(startIndex, endIndex).split(',');

  const updateAt = new Date(1e3 * (1 * Number(JSON.parse(list[1]))));

  return {
    res: STATUS_CODE.SUCCESS,
    data: {
      author,
      banner,
      authorAvatar,
      updateAt: dayjs(updateAt).format('YYYY-MM-DD hh:mm:ss'),
      title,
    },
  };
}

/**
 * 掘金文章解析器
 * @param {String} link
 * @returns
 */
async function juejinArticleResolver(link) {
  const res = await axios({ url: link });
  const $ = cheerio.load(res.data);

  const title = $('meta[itemprop="headline"]').attr('content');
  const updateAt = $('meta[itemprop="datePublished"]').attr('content');
  const author = $('meta[itemprop="name"]').attr('content');

  const authorAvatar = res.data.match(/avatar_large:"(.*?)"/)[1].replace(/\\u002F/g, '/');

  // banner 从data-n-head = ssr 中获取
  const ssr = $('script[data-n-head="ssr"]').text();
  let banner = '';

  if (ssr) {
    const [blogPost] = JSON.parse(ssr);
    const [image = ''] = blogPost.image;
    banner = image;
  }

  return {
    res: STATUS_CODE.SUCCESS,
    data: {
      author,
      banner,
      authorAvatar,
      updateAt: dayjs(updateAt).format('YYYY-MM-DD hh:mm:ss'),
      title,
    },
  };
}

async function zhihuArticleResolver(link) {
  const res = await axios({ url: link });
  const $ = cheerio.load(res.data);

  const title = $('.Post-Title').text();
  const authorAvatar = $('.Avatar.Avatar--round.AuthorInfo-avatar').attr('src');
  const author = $('.UserLink-link').text();
  const updateAt = $('.ContentItem-time').text().replace('发布于', '');
  const banner = $('.origin_image.zh-lightbox-thumb').attr('data-actualsrc');
  const content = $('.Post-RichTextContainer').html();

  return {
    res: STATUS_CODE.SUCCESS,
    data: {
      author,
      banner,
      authorAvatar,
      updateAt: dayjs(updateAt).format('YYYY-MM-DD hh:mm:ss'),
      title,
      content,
    },
  };
}

module.exports = {
  getArticleList,
  addArticle,
  // updateArticle,
  // deleteArticleById,

  // setStar,

  wechatArticleResolver,
  juejinArticleResolver,
  zhihuArticleResolver,
  articleResolver,
};
