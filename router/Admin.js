const express = require('express')
const router = express.Router()
const AdminFun = require('../router-fun/AdminFun')

//查询所有用户信息（管理员可以对所有用户更改）
router.post('/admin',AdminFun.Admin)

// 删除用户信息
router.post('/admin/user/del',AdminFun.AdminUserDel)

// 查询所有文章
router.post('/admin/article',AdminFun.AdminSelectArticle)

// 删除文章
router.post('/admin/article/del',AdminFun.AdminDelArticle)

// 更新文章
router.post('/admin/article/update',AdminFun.AdminUpArticle)

// 删除评论
router.post('/admin/comments/del',AdminFun.AdminDelComments)

// 上传图片
router.post('/admin/image/update',AdminFun.AdminUpImage)

// 查询图片
router.post('/admin/image/select',AdminFun.AdminImage)

// 删除图片
router.post('/admin/image/del',AdminFun.AdminDelImage)


module.exports = router