//文章管理

const express = require('express')
const router = express.Router()
const Article = require('../router-fun/ArticleFun.js')

// 删除文章
// router.post('/article/del',Article.DelArticle)

//查询文章
router.post('/article/select',Article.SelectArticle)

// 更改文章（添加和更新视为更新）
router.post('/article/change',Article.ChangeArticle)

//查询文章收藏
router.post('/article/collect',Article.CollectArticle)

module.exports = router