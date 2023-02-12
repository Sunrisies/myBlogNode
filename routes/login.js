const router = require('koa-router')()

router.prefix('/login')

router.get('/', function (ctx, next) {
  ctx.body = '登入'
})

router.post('/', async (ctx, next) => {
  if (!ctx.request.body) {
    ctx.body = '填写数据'
  } else {
    if (ctx.request.body.email !== 'admin') {
      ctx.response.status = 200
      ctx.body = {
        code: 0,
        message: '邮箱错误'
        // token: token
      }
    } else if (ctx.request.body.password !== '123456') {
      ctx.response.status = 200
      ctx.body = {
        code: 0,
        message: '密码错误'
        // token: token
      }
    } else {
      console.log(ctx.request.body.email)
      ctx.response.status = 200
      ctx.body = {
        code: 0,
        message: '登录成功'
        // token: token
      }
    }
  }
})

// const Router = require('koa-router')
// const queryback = require('../util/db/db.js')
// const login = new Router()

// const { md5, PWD_SALT, PRIVATE_KEY, EXPIRESD } = require('../util/encrpytion/md5.js')
// const jwt = require('jsonwebtoken')

//注册接口
// login.post('/register', async (ctx, next) => {
//   let myusername = ctx.request.body.username
//   let mypwd = ctx.request.body.password
//   let myemail = ctx.request.body.email
//   console.log(myusername, mypwd, myemail)
//   // 查询有无相同的用户名
//   let regis = await queryback(`select * from user where username = '${myusername}'`)
//   // 用户名不存在
//   if (!regis || regis.length === 0) {
//     // 调用加密方法给密码加密
//     mypwd = md5(`${mypwd}${PWD_SALT}`)
//     // 然后再插入到数据库
//     await queryback(`insert into user (username, password, email) values ('${myusername}','${mypwd}','${myemail}')`)
//     ctx.response.status = 200
//     ctx.body = {
//       code: 0,
//       msg: '注册成功！'
//     }
//   } else {
//     ctx.response.status = 400
//     ctx.body = {
//       code: -1,
//       msg: '账号已存在，请重新注册！'
//     }
//   }
// })

// //更新密码
// login.post('/forget', async (ctx) => {
//   let mypwd = ctx.request.body.password
//   let myemail = ctx.request.body.email
//   console.log(mypwd, myemail)
//   let regis = await queryback(`select * from user where email = '${myemail}'`)
//   // 邮箱不存在
//   if (!regis || regis.length === 0) {
//     ctx.response.status = 400
//     ctx.body = {
//       code: -1,
//       msg: '邮箱未注册，请先注册！'
//     }
//   } else {
//     // 调用加密方法给密码加密
//     mypwd = md5(`${mypwd}${PWD_SALT}`)
//     // 然后再插入到数据库
//     await queryback(`update user set password = '${mypwd}' where email = '${myemail}'`)
//     ctx.response.status = 200
//     ctx.body = {
//       code: 0,
//       msg: '修改成功！'
//     }
//   }
// })

// //登录接口
// // login.post('/', async (ctx, next) => {
// //   let { email, password } = ctx.request.body
// //   // let user = await queryback(`select username,email from user where username = '${myusername}' or email = '${myusername}'`)
// //   if (!email || email.length === 0) {
// //     //用户名不存在
// //     //返回时必须返回status,status状态码可与前端element-ui中的form表单一起使用，可以判断
// //     ctx.response.status = 400
// //     ctx.body = {
// //       code: -1,
// //       msg: '该账号不存在'
// //     }
// //   } else {
// //     // 调用加密方法给密码加密
// //     password = md5(`${password}${PWD_SALT}`)
// //     // 把加密过后的密码以及用户名 和 数据库的数据  匹配
// //     // let result = await queryback(
// //     //   `select * from user where username = '${myusername}' or email = '${myusername}' and password = '${mypwd}'`
// //     // )
// //     if (!password || password.length === 0) {
// //       ctx.response.status = 404
// //       ctx.body = {
// //         code: -1,
// //         msg: '账号或密码不正确'
// //       }
// //     } else {
// //       // 如果该结果存在说明登录成功，则生成token
// //       let token = jwt.sign(
// //         {
// //           myusername
// //         },
// //         PRIVATE_KEY,
// //         {
// //           expiresIn: EXPIRESD
// //         }
// //       )
// //       ctx.response.status = 200
// //       ctx.body = {
// //         code: 0,
// //         msg: '登录成功',
// //         token: token
// //       }
// //     }
// //   }
// // })

// // 获取用户信息
// login.get('/info', async (ctx, next) => {
//   // 这个req是经过了 koaJwt拦截token 后得到的对象  req.user可得到解密后的token信息
//   // console.log(ctx.request.body.user);
//   let token = ctx.request.header.authorization.split(' ')[1]
//   console.log(token)
//   if (token) {
//     let jiemi = await jwt.verify(token, PRIVATE_KEY, (err, data) => {
//       console.log(data)
//       return data
//     })
//     let myusername = jiemi.myusername
//     console.log(myusername)
//     let userinfo = await queryback(`select test from user where username = '${myusername}'`)
//     console.log(userinfo)
//     ctx.response.status = 200
//     ctx.body = {
//       code: 0,
//       msg: '成功',
//       data: userinfo
//     }
//   }
// })

module.exports = router
