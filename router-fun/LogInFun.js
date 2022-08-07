//注册和登入函数

const db = require('../db/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config.js')

var time = () => {
  let t = new Date()
  let Y = t.getFullYear()
  let M = t.getMonth()
  let D = t.getDate()
  let h = t.getHours()
  let m = t.getMinutes()
  let s = t.getSeconds()
  return `${Y}-${M + 1}-${D} ${h}:${m}:${s}`
}


exports.LogIn = (req,res) => {
  const userInfo = req.body
  if(!userInfo.username || !userInfo.password ) return res.send({status: 1,message: '不能为空'})
  db.query('select username from ev_users where username = ?',[userInfo.username],(err,Uresulst) => {
    if (err) return res.send({status: 1,message: err.message})
    if (Uresulst.length === 0) return res.send({status: 1,message: '没有该用户'})

    db.query('select * from ev_users where username =?',[userInfo.username],(err,results) => {
      if (err) return res.send({status: 1,message: err.message})
      //bcryptjs插件可以判断密码和数据库密码是否正确
      const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
      if (!compareResult) return res.send({status: 1,message: '密码错误'})
      //排除密码和照片
      const user = {...results[0],password: '',user_pic:''}
      //将信息变为token，规则储存在config.js中
      const tokenStr = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: '24h', // token 有效期为 24 个小时
      })
      if (results[0].management === 1) {
        return res.send({
          status: -1,
          message: '管理员登录成功！',
          token: 'Bearer ' + tokenStr,
        })
      }
      res.send({
        status: 0,
        message: '登入成功',
        token: 'Bearer ' + tokenStr,
      })
    })
  })
  
}

exports.regUser = (req,res) => {
  const userInfo = req.body
  const date = time()
  if (!userInfo.username || !userInfo.password) return res.send({status: 1,message: '不能为空'})
  db.query('select * from ev_users where username = ?',[userInfo.username],(err,results) => {
    if (err) return res.send({status: 1,message: err.message})
    if(results.length > 0) return res.send({status: 1, message: '用户名已被注册'})
    //将密码加密为10位字符
    userInfo.password = bcrypt.hashSync(userInfo.password,10)
    if (userInfo.management == 1) {
      db.query('insert into ev_users set ?',{username: userInfo.username,password: userInfo.password,management: userInfo.management,date: date},(err,results) => {
        if(err) return res.send({status: 1, message: err.message})
        // 用户姓名等信息表储存
        db.query('insert into ev_userinfo set username = ?',[userInfo.username],(err,results2) => {
          if(err) return res.send({status: 1, message: err.message})
          res.send({status: 0,message: '注册为管理员'})
        })
      })
    }else{
      db.query('insert into ev_users set ?',{username: userInfo.username,password: userInfo.password,date: date},(err,results) => {
        if(err) return res.send({status: 1, message: err.message})
        // 用户姓名等信息表储存
        db.query('insert into ev_userinfo set username = ?',[userInfo.username],(err,results2) => {
          if(err) return res.send({status: 1, message: err.message})
          res.send({status: 0,message: '注册成功'})
        })
      })
    }
  })
}

//查询用户名重复
exports.UserSelect = (req,res) => {
  const name = req.body
  db.query('select username from ev_users where username = ?',[name.username],(err,resulst) => {
    if(err) return res.send({status: 1, message: err.message})
    if(resulst.length > 0) return res.send({status: 0, message: '用户名重复', data: false})//y用data是true或者false代表是否重复
    res.send({status: 0, message: '用户名可用', data: true})
  })
}

// 查看评论(评论查看不设权限)
exports.SelectComments = (req,res) => {
  db.query('select * from ev_comments',[],(err,sresults) => {
    if(err) return res.send({status: 1,message: err.message})
    res.send({status:0,message: '查询成功',data: sresults})
  })
}