const router = require('koa-router')();

const { getMovieList, addMovie, getMovieListByBTNULL } = require('../service/movie.service');

router.prefix('/movie');

router.get('/', async (ctx) => {
  ctx.body = await getMovieList(ctx.request.query);
});

router.get('/bar', (ctx) => {
  ctx.body = 'this is a users/bar response';
});

router.post('/edit', async (ctx) => {
  //  请求参数

  const { id, ...params } = ctx.request.body;

  try {
    await addMovie(params);

    ctx.body = {
      res: 0,
      msg: '添加成功',
    };
  } catch (err) {
    ctx.body = {
      res: 1,
      msg: err,
    };
  }
});

router.get('/search', async (ctx) => {
  ctx.body = await getMovieListByBTNULL(ctx.request.query);
});

module.exports = router;
