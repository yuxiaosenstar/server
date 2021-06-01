const Koa = require('koa')
const Router = require('koa-router')
const KoaBody = require('koa-body')
const Sequelize = require('sequelize')
const cors = require('@koa/cors')
const fs = require('fs')
const path = require('path')
const marked = require('marked')
const koaStatic = require('koa-static')

const app = new Koa()
const router = new Router()

const result = function (data) {
  return {
    success: true,
    data: data,
  }
}

let config = {
  host: 'localhost',
  user: 'root',
  password: '11111111',
  database: 'demo',
  host: 3306,
}

let sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
})

let Pet = sequelize.define(
  'tab1',
  {
    name: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    age: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    tableName: 'tab1',
  }
)

/** 查询全部 */
router.get('/user/all', async (ctx) => {
  let target = await Pet.findAll()
  ctx.type = 'application/json'
  ctx.body = target
  console.log(ctx)
})

/** 查询单个 */
router.get('/user', async (ctx) => {
  let name = ctx.query.name
  let target = await Pet.findOne({
    where: {
      name,
    },
  })
  ctx.type = 'application/json'
  ctx.body = target
  console.log(ctx)
})

/** 删除单个 */
router.del('/user', async (ctx) => {
  let name = ctx.query.name
  await Pet.destroy({
    where: {
      name,
    },
  })
  ctx.type = 'application/json'
  ctx.body = true
})

/** 新增单个 */
router.post('/user', async (ctx) => {
  let data = ctx.request.body
  await Pet.create(data)
  ctx.type = 'application/json'
  ctx.body = data
})

/** 修改单个 */
router.patch('/user', async (ctx) => {
  let data = ctx.request.body
  await Pet.update(data, {
    where: {
      name: data.name,
    },
  })
  ctx.type = 'application/json'
  ctx.body = data
})

router.get('/table-data', async (ctx) => {
  await new Promise(function (res, rej) {
    setTimeout(() => {
      ctx.type = 'application/json'
      ctx.body = [
        {
          id: 1,
          name: 'ycc',
        },
        {
          id: 2,
          name: 'yu',
        },
        {
          id: 2,
          name: 'yu',
        },
        {
          id: 2,
          name: 'yu',
        },
        {
          id: 2,
          name: 'yu',
        },
      ]
      res()
    }, 50000)
  })
})

router.post('/uploadfile', async (ctx, next) => {
  const file = ctx.request.files.file
  ctx.body = result({ path: file.path })
})

router.post('/uploadfiles', async (ctx, next) => {
  // 上传多个文件
  const files = ctx.request.files.file // 获取上传文件
  for (let file of files) {
    // 创建可读流
    const reader = fs.createReadStream(file.path)
    // 获取上传文件扩展名
    let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
  }
  return (ctx.body = '上传成功！')
})

router.get('/news', (ctx) => {
  let dirs = fs.readdirSync(path.join(__dirname, 'public/upload/'))
  let files = []
  for (const dir of dirs) {
    if (dir.endsWith('.md')) {
      let file = fs.readFileSync(
        path.join(__dirname, 'public/upload/', dir),
        'utf-8'
      )
      files.push({
        title: dir,
        content: marked(file),
        type: 'md',
      })
    }
    if (dir.endsWith('.png')) {
      files.push({
        title: dir,
        content: `${ctx.origin}/upload/${dir}`,
        type: 'img',
      })
    }
  }
  ctx.body = result(files)
})
app.use(cors())
app.use(
  KoaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, 'public/upload'),
      // 保留文件扩展名
      keepExtensions: true,
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
      onFileBegin:(name,file) => {
        // console.log(file);
        // 获取文件后缀
        const ext =getUploadFileExt(file.name);
        // 最终要保存到的文件夹目录
        const dir = path.join(__dirname,`public/upload`);
        // 检查文件夹是否存在如果不存在则新建文件夹
        checkDirExist(dir);
        // 重新覆盖 file.path 属性
        file.path = `${dir}/${getUploadFileName(ext)}`;
      },
      onError:(err)=>{
        console.log(err);
      }
    },
  })
)
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(router.routes())

app.listen(5000)
