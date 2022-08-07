const db = require('../db/index.js')

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

//判断有无管理员权限,以/my/admin开头的都需要经过函数验证，这里应该挂载到全局，节省时间就用函数判断
var admin = (management, res) => {
  if (management == 0) {
    return res.send('你没有权限')
  }
}

// 查询用户
exports.Admin = (req, res) => {
  admin(req.user.management, res)
  db.query('select * from ev_users', [], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    res.send({ status: 0, message: '获取成功', data: results })
  })
}

// 删除用户
exports.AdminUserDel = (req, res) => {
  admin(req.user.management, res)
  const userInfo = req.body
  if (userInfo.username === req.user.username) return res.send({ status: 0, message: '不要删除自己哦' })
  db.query('select management from ev_users where username = ?', [userInfo.username], (err, resulst) => {
    if (err) return res.send({ status: 1, message: err.message })
    if (resulst[0].management == 0) {
      db.query('delete from ev_users where username = ?', [userInfo.username], (err, results) => {
        if (err) return res.send({ status: 1, message: err.message })
        res.send({ status: 0, message: '删除成功' })
      })
    } else if (resulst[0].management == 1) {
      res.send({ status: 0, message: "不能删除管理员" })
    }
  })
}

// 查询文章
exports.AdminSelectArticle = (req, res) => {
  admin(req.user.management, res)
  db.query('select * from ev_articles', [], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    res.send({ status: 0, message: '获取成功', data: results })
  })
}

// 删除文章
exports.AdminDelArticle = (req, res) => {
  admin(req.user.management, res)
  const info = req.body
  db.query('delete from ev_articles where username = ?&&articletitle = ?', [info.username, info.title], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    if (results.affectedRows != 1) return res.send({ status: 1, message: '' })
    res.send({ status: 0, message: '删除成功' })
  })
}

// 更新文章
exports.AdminUpArticle = (req, res) => {
  admin(req.user.management, res)
  const info = req.body
  db.query('update ev_articles set content = ? where username = ?&&articletitle = ?', [info.content, info.username, info.title], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    if (results.affectedRows != 1) return res.send({ status: 1, message: '错误' })
    db.query('select content from ev_articles where username = ?&&articletitle = ?', [info.username, info.title], (err, sresults) => {
      if (err) return res.send({ status: 1, message: err.message })
      res.send({ status: 0, message: '更新成功', data: sresults })
    })
  })
}

// 删除评论
exports.AdminDelComments = (req, res) => {
  admin(req.user.management, res)
  const info = req.body
  db.query('delete from ev_comments where username = ?&&title = ?&&articleuser = ?', [info.username, info.title, info.articleuser], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    if (results.affectedRows != 1) return res.send({ status: 1, message: '错误' })
    res.send({ status: 0, message: '删除成功' })
  })
}

// 上传图片
exports.AdminUpImage = (req, res) => {
  admin(req.user.management, res)
  const info = req.body
  db.query('select * from ev_image where username = ?&&title = ?', [info.username, info.title], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    let date = time()
    if (results.length === 0) {
      // 没有关于用户文章的图片就插入新的数据，有则更新数据
      db.query('insert into ev_image set username = ?,title = ?,articleimage = ?,date = ?', [info.username, info.title, info.articleimage, date], (err, results) => {
        if (err) return res.send({ status: 1, message: err.message })
        res.send({ status: 0, message: '上传成功' })
      })
    } else if (results.length === 1) {
      db.query('update ev_image set articleimage = ?,date = ? where username = ?&&title = ?', [info.articleimage, date, info.username, info.title], (err, results) => {
        if (err) return res.send({ status: 1, message: err.message })
        res.send({ status: 0, message: '更新成功' })
      })
    }
  })
}

// 查询图片
exports.AdminImage = (req, res) => {
  admin(req.user.management, res)
  db.query('select * from ev_image', [], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    res.send({ status: 0, message: '获取成功', data: results })
  })
}

// 删除图片
exports.AdminDelImage = (req, res) => {
  admin(req.user.management, res)
  const info = req.body
  db.query('delete from ev_image where username = ?&&title = ?', [info.username, info.title], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    res.send({ status: 0, message: '删除成功' })
  })
}