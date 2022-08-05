// 用户信息管理

const express = require('express')
const router = express.Router()
const UserFun = require('../router-fun/UserIfonFun.js')

router.post('/info',UserFun.UserIfon)

router.post('/change',UserFun.UserChange)

router.post('/del',UserFun.UserDel)

router.post('/password',UserFun.UserPassword)

router.post('/collect',UserFun.UserCollect)

module.exports = router