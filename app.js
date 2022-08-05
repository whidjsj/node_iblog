const express = require('express')
const app = express()

app.all('/api/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, token')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
  res.header('Content-Type', 'application/json;charset=UTF-8')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  if (req.method == 'OPTIONS') res.send(200)
  /*让options请求快速返回*/
  else next()
})
app.use(express.urlencoded({extended: false}))

//解析token
const expressJWT = require('express-jwt')
const config = require('./config')
//以api开头的不需要token
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
//全局中间件，捕获token认证失败错误，并返回错误信息
app.use(function(err, req, res, next){
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.send({status: 1,message:'身份认证失败！'})
})


//登入注册
const LogIn = require('./router/LogIn.js')
app.use('/api',LogIn)
//用户信息更新和查询
const UserIfon = require('./router/UserIfon.js')
app.use('/my',UserIfon)
// 管理员
const Admin = require('./router/Admin')
app.use('/my',Admin)
//文章
const Article = require('./router/Article')
app.use('/my',Article)


app.listen(3007,function(){
  console.log('启动在 127.0.0.1:3007');
})