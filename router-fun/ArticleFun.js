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

var addArticle = (db, title, content, time, req, res) => {
  db.query('insert into ev_articles set title = ?,content = ?,time = ?,username = ?', [title, content, time, req.user.username], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    res.send({ status: 0, message: '文章添加成功' })
  })
}

exports.ChangeArticle = (req, res) => {
  let date = time()
  const userIfon = req.body
  db.query('select username from ev_articles where username = ?', [req.user.username], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    if (results.length < 1 && results.length > -1) {
      // 判断用户有没有发过文章，没有就直接添加
      addArticle(db, userIfon.title, userIfon.content, date, req, res)

    } else {
      // 用户发过文章判断有没有相同标题
      db.query('select title from ev_articles where title = ?', [userIfon.title], (err, results) => {
        if (err) return res.send({ status: 1, message: err.message })
        if (results.length < 1 && results.length > -1) {
          // 没有相同标题同样添加
          addArticle(db, userIfon.title, userIfon.content, date, req, res)

        } else {
          // 有相同标题就更新文章
          db.query('update ev_articles set title = ?,content = ? where username = ?', [userIfon.title, userIfon.content, req.user.username], (err, results) => {
            if (err) return res.send({ status: 1, message: err.message })
            res.send({ status: 0, message: '文章更新成功' })
          })
        }
      })
    }
  })
}


//获取自己的所有文章
exports.SelectArticle = (req, res) => {
  db.query('select title,content from ev_articles where username = ?', [req.user.username], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    res.send({
      status: 0,
      message: '获取成功',
      date: results
    })
  })
}


//删除文章
exports.DelArticle = (req, res) => {
  const userIfon = req.body
  db.query('delete from ev_articles where username = ?&&title = ?', [req.user.username, userIfon.title], (err, results) => {
    if (err) return res.send({ status: 1, message: err.message })
    res.send({ status: 0, message: '删除成功' })
  })
}

//查询文章收藏
exports.CollectArticle = (req,res) => {
  const info = req.body
  var userTable = []
  db.query('select username from ev_collect where title = ?',[info.title],(err,results) => {
    if (err) return res.send({ status: 1, message: err.message })
    // res.send(results)
    for(let i = 0;i < results.length;i++){
      db.query('select user_pic,username from ev_users where username = ?',[results[i].username],(err,results2) => {
        if (err) return res.send({ status: 1, message: err.message })
        userTable.push(results2[0])
        if (userTable.length == results.length) {
          res.send({status: 0,message: '获取成功',data: userTable})
        }
      })
    }
  })
}