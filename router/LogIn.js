// 登入注册


const express = require('express')
const router = express.Router()
const LogInFun = require('../router-fun/LogInFun.js')

router.post('/login',LogInFun.LogIn)

router.post('/reguser',LogInFun.regUser)

// 用户名查重
router.post('/select',LogInFun.UserSelect)

// 查看评论
router.post('/select/comments',LogInFun.SelectComments)

module.exports = router