const {
  getArticleList,
  addArticle,
  updateArticle,
  deleteArticleById,
  articleResolver,
  setStar,
} = require('../service/article.service');

const router = require('koa-router')();

router.prefix('/article');

/**
 * *done
 * 获取文章列表
 */
router.get('/list', async (ctx) => {
  ctx.body = await getArticleList(ctx.query);
});

/**
 * *done
 * 新增文章
 */
router.post('/add', async (ctx) => {
  const { title = '', image: banner = '', link = '', content = '' } = ctx.request.body;
  const res = await articleResolver(link);
  const { title: originTitle, banner: originBanner, content: originContent } = res.data;

  ctx.body = await addArticle({
    originLink: link,
    ...res.data,
    title: title || originTitle,
    banner: banner || originBanner,
    content: content || originContent,
  });
});

/**
 * 当admin端，只输入一个链接的时候，进行预解析
 */
router.post('/pre-parse', async (ctx) => {
  const { link = '' } = ctx.request.body;

  ctx.body = await articleResolver(link);
});

router.post('/update', async (ctx) => {
  ctx.body = await updateArticle(ctx.request.body);
});

router.post('/set-star', async (ctx) => {
  ctx.body = await setStar(ctx.request.body);
});

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params;

  ctx.body = await deleteArticleById({ id });
});

module.exports = router;
