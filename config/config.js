// 1、mysql数据库连接
// config.js

let config
//数据库配置
config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '1234',
  database: 'back_project_2'
}

module.exports = config

db.js
const config = require('./config')
const mysql = require('mysql')

//创建连接池
let pool = mysql.createPool(config)

//基础
// //对数据库进行增删改查操作的基础
// function query(sql,callback){
//     //创建连接
//     pool.getConnection(function(err,connection){
//         connection.query(sql,function(err,rows){
//             //表示连接成功时有错误即抛出错误，没有错误即返回取得的数据
//             callback(err,rows)
//             //中断连接
//             connection.release()
//         })
//     })
// }

//直接使用含回调的即可
function queryback(sql) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        //事件驱动回调
        connection.query(sql, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
        //释放连接
        connection.release()
      }
    })
  }).catch((err) => {
    console.log(err)
  })
}
module.exports = queryback

// 2、验证码发送
//验证码配置
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

const transport = nodemailer.createTransport(
  smtpTransport({
    host: 'smtp.163.com', // 服务 由于我用的163邮箱
    port: 465, // smtp端口 默认无需改动
    secure: true,
    auth: {
      user: '******@163.com', // 邮箱用户名
      pass: '**********' // SMTP授权码  //邮箱设置中开启
    }
  })
)

const randomFns = () => {
  // 生成6位随机数
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += parseInt(Math.random() * 10)
  }
  return code
}

const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则

const emailModel = async (EMAIL, code, call) => {
  transport.sendMail(
    {
      from: '******@163.com', // 发件邮箱，须根上面的邮箱用户名一样
      to: EMAIL, // 收件列表
      subject: '验证你的电子邮件', // 标题
      html: `
      <p>你好！</p>
      <p>您正在注册龙雀社区账号</p>
      <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
      <p>***该验证码5分钟内有效***</p>` // html 内容
    },
    (error, data) => {
      if (error) {
        call(false)
      } else {
        call(true)
      }
      // console.log(1,error)
      // console.log(2,data)
      transport.close() // 如果没用，关闭连接池
    }
  )
  //....验证码发送后的相关工作
}

module.exports = {
  regEmail,
  randomFns,
  emailModel
}

调用验证码
const Router = require('koa-router')
const queryback = require('../util/db/db.js')
const email = new Router()

const { regEmail, emailModel, randomFns } = require('../util/email/emailConfig')

//注册验证码
email.post('/', async (ctx, next) => {
  let Email = ctx.request.body.email
  console.log(Email)
  let find = await queryback(`select email from user where email = '${Email}'`)
  // console.log(find);
  if (!find || find.length === 0) {
    let code = randomFns()
    console.log(code)
    if (regEmail.test(Email)) {
      await queryback(`insert into emails (email,code) values ('${Email}','${code}')`)

      //重点，化为异步之后方可实现返回验证码发送之后的结果
      //await是异步的标志，new promise是异步的施行
      let dd = await new Promise((resolve, reject) => {
        emailModel(Email, code, (call) => {
          resolve(call)
        })
      })
      console.log(dd)
      if (dd === true) {
        ctx.response.status = 200
        ctx.body = {
          code: 0,
          msg: '验证码已发送'
        }
        setTimeout(async () => {
          //5分钟后失效
          await queryback(`delete from emails where email = '${Email}'`)
        }, 1000 * 60 * 5)
      } else {
        ctx.response.status = 200
        ctx.body = {
          code: 0,
          msg: '验证码发送失败，请稍后再试'
        }
      }
    } else {
      // assert(false,422,'请输入正确的邮箱格式！')
      ctx.response.status = 422
      ctx.body = {
        code: 0,
        msg: '请输入正确的邮箱格式'
      }
    }
  } else {
    ctx.response.status = 400
    ctx.body = {
      code: -1,
      msg: '该邮箱已注册'
    }
  }
})

//校验验证码
email.post('/examEmail', async (ctx) => {
  const email = ctx.request.body.email
  const code = ctx.request.body.code
  const examE = await queryback(`select * from emails where email = '${email}' and code = '${code}'`)
  if (!examE || examE.length === 0) {
    ctx.response.status = 400
    ctx.body = {
      code: 0,
      msg: '验证码错误，请稍后再试'
    }
  } else {
    ctx.response.status = 200
    ctx.body = {
      code: 0,
      msg: '验证码填写正确'
    }
  }
})

module.exports = email
