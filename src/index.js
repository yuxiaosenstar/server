const Koa = require('koa');
const Router = require('koa-router');
const Sequelize = require('sequelize');

let config = {
  host: 'localhost',
  user: 'root',
  password: '11111111',
  database: 'demo',
  host: 3306
};
const app = new Koa();
const router = new Router();

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

router.get('/user/all', async (ctx) => {
  let target = await Pet.findAll()
  ctx.type = 'application/json';
  ctx.body = target;
  console.log(ctx);
})

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

app.use(router.routes());

app.listen(5000);