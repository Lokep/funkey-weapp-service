const {
  getArticleList,
  addArticle,
  updateArticle,
  deleteArticleById,
} = require('../service/article.service');

const router = require('koa-router')();

router.prefix('/article');

router.get('/list', async (ctx) => {
  ctx.body = await getArticleList(ctx.query);
});

router.post('/add', async (ctx) => {
  ctx.body = await addArticle(ctx.request.body);
});

router.post('/update', async (ctx) => {
  ctx.body = await updateArticle(ctx.request.body);
});

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params;

  ctx.body = await deleteArticleById({ id });
});

module.exports = router;
