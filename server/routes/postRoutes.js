const express = require('express')
const router = express.Router()
const postsController = require('../controllers/postsController')

router.route('/')
  .get()
  .post()

router.route('/comment')
  .patch()

router.route('/paging')
  .get();

router.route('/like').patch()
router.route('/unlike').patch()

router.route('/:id').delete()

router.route('/modal/:id').get()

module.exports = router