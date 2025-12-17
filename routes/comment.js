const express = require('express')
const router = express.Router()
const {getComments, addComment, deleteComment} = require('../controllers/comment')

router.post('/getComments', getComments)

router.post('/addComment', addComment)

router.post('/deleteComment', deleteComment)

module.exports = router