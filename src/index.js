const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
const Sequelize = require('sequelize');

const app = new Koa();
const router = new Router();

let config = {
  host: 'localhost',
  user: 'root',
  password: '11111111',
  database: 'demo',
  host: 3306
};

let sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql'
});

let Pet = sequelize.define('tab1', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  age: Sequelize.INTEGER
}, {
  timestamps: false,
  tableName: 'tab1'
});

/** 查询全部 */
router.get('/user/all', async (ctx) => {
  let target = await Pet.findAll()
  ctx.type = 'application/json';
  ctx.body = target;
  console.log(ctx);
})

/** 查询单个 */
router.get('/user', async (ctx) => {
  let name = ctx.query.name;
  let target = await Pet.findOne({
    where: {
      name
    }
  })
  ctx.type = 'application/json';
  ctx.body = target;
  console.log(ctx);
})

/** 删除单个 */
router.del('/user', async (ctx) => {
  let name = ctx.query.name;
  await Pet.destroy({
    where: {
      name
    }
  });
  ctx.type = 'application/json';
  ctx.body = true;
})

/** 新增单个 */
router.post('/user', async (ctx) => {
  let data = ctx.request.body;
  await Pet.create(data)
  ctx.type = 'application/json';
  ctx.body = data;
})

/** 修改单个 */
router.patch('/user', async (ctx) => {
  let data = ctx.request.body;
  await Pet.update(data, {
    where: {
      name: data.name
    }
  });
  ctx.type = 'application/json';
  ctx.body = data;
})

app.use(KoaBody());
app.use(router.routes());

app.listen(5000);