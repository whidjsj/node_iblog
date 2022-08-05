const db = require('../db/index.js')
const bcrypt = require('bcrypt')

//这里的req.user不是客户端发来的，而是token-jwt解析出来挂载到req上的
exports.UserIfon = (req,res) => {
  db.query('select username,nickname,email,user_pic,management from ev_users where username = ?',[req.user.username],(err,resulst) => {
    if(err) return res.send({status: 1,messsage: err.message})
    db.query('select * from ev_userinfo where username = ?',[req.user.username],(err,sresulst) => {
      res.send({status: 0,message: '获取成功',data: resulst, data2: sresulst})
    })
  })
}

//更新用户信息（不包括密码）（用户传递修改的邮箱，昵称，头像）
exports.UserChange = (req,res) => {
  const userInfo = req.body
  // 如果没有传递信息会被更新为空应该加入判断是否为空来防止信息被更新为空，这里不做判断
  db.query('update ev_users set nickname = ?,email = ?, user_pic = ? where username = ?',[userInfo.nickname,userInfo.email,userInfo.user_pic,req.user.username],(err,resulst) => {
    if(err) return res.send({status: 1,message: err.message})
    // 更新用户姓名信息
    if (!userInfo.nameInfo) {
      res.send({status: 0,message: '更新昵称等信息成功'})
    }else{
      db.query('update ev_userinfo set name = ?, birthday = ?, introduce = ?, gender = ? where username = ?',[userInfo.nameInfo.name, userInfo.nameInfo.birthday, userInfo.nameInfo.introduce, userInfo.nameInfo.gender, req.user.username],(err,resulst) => {
        if(err) return res.send({status: 1,message: err.message})
        res.send({status: 0,message: '更新姓名等信息成功'})
      })
    }
    
  })
}

//删除用户(从token拿取用户名，用户传密码)
exports.UserDel = (req,res) => {
  const userInfo = req.body
  db.query('select password from ev_users where username = ?',[req.user.username],(err,resulst) => {
    if(err) return res.send({status: 1,message: err.message})
    const compareResult = bcrypt.compareSync(userInfo.password, resulst[0].password)
    if (compareResult) {
      // 删除用户账号信息
      db.query('delete from ev_users where username = ?',[req.user.username],(err,results) => {
        if(err) return res.send({status: 1,message: err.message})
        if(results.affectedRows == 0) res.send({status: 1,message: '错误'})
        // 删除用户的姓名等信息
        db.query('delete from ev_userinfo where username = ?',[req.user.username],(err,dresulst) => {
          if(err) return res.send({status: 1,message: err.message})
          if(dresulst.affectedRows == 0) res.send({status: 1,message: '错误'})
        })
        res.send({status: 0,message: '删除成功'})
      })
    }else{
      res.send({status: 1,message: '密码错误'})
    }
  })
}

//更新密码
exports.UserPassword = (req,res) => {
  
}

//用户收藏(把文章信息传递进去,包含标题和作者信息)
exports.UserCollect = (req,res) => {
  db.query('select * from ev_collect where title = ?&& author = ?&&username = ?',[info.title,info.author,req.user.username],(err,results) => {
    if(err) return res.send({status: 1,message: err.message})
    if(results.lenght != 0) return res.send({status: 0,message: '取消收藏'})
    db.query('insert into ev_collect set title = ?,author = ?,username = ?',[info.title,info.author,req.user.username],(err,results) => {
      if(err) return res.send({status: 1,message: err.message})
      if(results.affectedRows != 1) return res.send({status: 1,message: '请稍后再试'})
      res.send({status: 0,message: '添加喜欢成功'})
    })
  })
}